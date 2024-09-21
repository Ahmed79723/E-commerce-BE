import { Cart } from "../../../models/cart.model.js";
import { Coupon } from "../../../models/coupon.model.js";
import { Product } from "../../../models/product.model.js";
import { calcTotalCartPrice } from "../../middleWares/cart/cartMW.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { clearCart } from "../handlers/handlers.js";

// ~=====================================|add To cart|===================================================
const addToCart = errorHandler(async (req, res, next) => {
  const userCart = new Cart({
    userId: req.validMWUser._id,
    cartItems: [req.body],
  });
  calcTotalCartPrice(userCart);
  await userCart.save();
  // if cart is added
  userCart && res.status(201).json({ msg: "success", userCart });
  // if cart not added
  userCart || next(new AppError("cart not added", 404));
});
// ~=====================================|update Quantity|===================================================
const updateQuantity = errorHandler(async (req, res, next) => {
  const cart = await Cart.findOne({
    userId: req.sysUser.userId,
  });
  if (!cart) return next(new AppError("cart not found", 404));
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("product Not found", 404));

  const item = cart.cartItems.find((item) => item.product == req.params.id);
  if (!item) return next(new AppError("product Not found in cart", 404));
  item.quantity = req.body.quantity;
  if (item.quantity > product.stock)
    return next(new AppError("product quantity exceeded stock", 404));
  calcTotalCartPrice(cart);

  await cart.save();
  cart && res.status(201).json({ msg: "success", cart });
});
// ~=====================================|remove Item from Cart|===================================================
const removeCartItem = errorHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.sysUser.userId },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    {
      new: true,
    }
  );
  if (!cart) return next(new AppError("cart or product not found", 404));
  calcTotalCartPrice(cart);
  await cart.save();
  cart && res.status(201).json({ msg: "success", cart });
});
// ~=====================================|get Logged User Cart|===================================================
const getLoggedUserCart = errorHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.sysUser.userId });
  cart && res.status(201).json({ msg: "success", cart });
  cart || next(new AppError("cart not found", 404));
});
// ~=====================================|Apply coupon|===================================================
const applyCoupon = errorHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ code: req.body.code });
  if (!coupon) return next(new AppError("coupon is invalid", 404));
  if (coupon.expireOn.getTime() < Date.now())
    return next(new AppError("coupon is expired", 404));
  const cart = await Cart.findOne({ userId: req.sysUser.userId });
  cart.discount = coupon.discountPercentage;
  calcTotalCartPrice(cart);
  await cart.save();
  cart && res.status(201).json({ msg: "success", cart });
  cart || next(new AppError("cart not found", 404));
});
// ~=====================================|clear User Cart|===================================================
// const clearUserCart = errorHandler(async (req, res, next) => {
//   console.log("test");

//   const cart = await Cart.findOneAndDelete({ userId: req.sysUser.userId });
//   cart && res.status(201).json({ msg: "success", cart });
//   cart || next(new AppError("cart not found", 404));
// });
const clearUserCart = clearCart(Cart);

export {
  addToCart,
  updateQuantity,
  removeCartItem,
  getLoggedUserCart,
  clearUserCart,
  applyCoupon,
};
