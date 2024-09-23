import { Cart } from "../../../models/cart.model.js";
import { Order } from "../../../models/order.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../models/product.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.Stripe_Secret_Key);
import { clearCart } from "../handlers/handlers.js";
import { Coupon } from "../../../models/coupon.model.js";
import { calcTotalCartPrice } from "../../middleWares/cart/cartMW.js";

// ~=====================================|create Cash Order|===================================================
const createCashOrder = errorHandler(async (req, res, next) => {
  // 1-get user cart by cartID
  const cart = await Cart.findOne({
    userId: req.sysUser.userId,
  });
  if (!cart) return next(new AppError("cart not found", 404));
  // 2-total order price
  // 3-create order
  const order = await Order.create({
    userId: req.sysUser.userId,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    discount: cart.discount || undefined,
    totalOrderPrice: cart.totalPriceAfterDiscount || cart.totalCartPrice,
  });
  await order.save();
  // if order is created
  order && res.status(201).json({ msg: "success", order });
  // if order not created
  order || next(new AppError("order not created", 404));
  // 4-increment sold and decrement stock
  const options = cart.cartItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.product },
        update: { $inc: { sold: prod.quantity, stock: -prod.quantity } },
      },
    };
  });
  await Product.bulkWrite(options);
  // 5-clear user cart
  await Cart.findByIdAndDelete(cart._id);
  // clearCart(Cart);

  // const userCart = new Cart({
  //   userId: req.validMWUser._id,
  //   cartItems: [req.body],
  // });
  // calcTotalCartPrice(userCart);
  // await userCart.save();
});
// ~=====================================|get User Orders|===================================================
const getUserOrders = errorHandler(async (req, res, next) => {
  const orders = await Order.find({ userId: req.sysUser.userId }).populate(
    "orderItems.product"
  );
  // if orders are found
  orders.length && res.status(200).json({ msg: "success", orders });
  // if no orders found
  orders.length || next(new AppError(`no orders found`, 404));
});
// ~=====================================|get All Orders|===================================================
const getAllOrders = errorHandler(async (req, res, next) => {
  const orders = await Order.find();
  // if orders are found
  orders && res.status(200).json({ msg: "success", orders });
  // if no orders found
  orders || next(new AppError(`no orders found`, 404));
});
// ~=====================================|create checkout session|===================================================
const createCheckoutSession = errorHandler(async (req, res, next) => {
  const cart = await Cart.findOne({
    userId: req.sysUser.userId,
  });
  // console.log(req.validMWUser);

  if (!cart) return next(new AppError("cart not found", 404));
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "egp",
          unit_amount:
            (cart.totalPriceAfterDiscount || cart.totalCartPrice) * 100,
          product_data: {
            name: req.validMWUser.username,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://e-commerce-fresh-cart-snowy.vercel.app/#/AllOrders",
    cancel_url: "https://e-commerce-fresh-cart-snowy.vercel.app/#/Cart",
    customer_email: req.validMWUser.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.json({ msg: "success", session });
});

export { createCashOrder, getUserOrders, getAllOrders, createCheckoutSession };
