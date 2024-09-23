import { Cart } from "../../../models/cart.model.js";
import { Product } from "../../../models/product.model.js";
import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../errorHandler.js";

function calcTotalCartPrice(cartExists) {
  cartExists.totalCartPrice = cartExists.cartItems.reduce(
    (prev, item) => (prev += item.price * item.quantity),
    0
  );
  if (cartExists.discount) {
    cartExists.totalPriceAfterDiscount =
      cartExists.totalCartPrice -
      cartExists.totalCartPrice * (cartExists.discount / 100);
  }
}
const cartMW = errorHandler(async (req, res, next) => {
  const cartExists = await Cart.findOne({ userId: req.validMWUser._id });
  const product = await Product.findById(req.body.product);
  req.body.price = product?.price;
  if (!product) return next(new AppError("product Not found", 404));
  if (product.stock < req.body.quantity)
    return next(new AppError("product quantity exceeded stock", 409));
  if (!cartExists) {
    return next();
  } else {
    // =================================|mu3ti code|====================================|
    const item = cartExists.cartItems.find(
      (item) => item.product == req.body.product
    );
    if (item) {
      item.quantity += req.body.quantity || 1;
      if (item.quantity > product.stock)
        return next(new AppError("product quantity exceeded stock", 404));
    }
    if (!item) cartExists.cartItems.push(req.body);
    // let totalCartPrice = 0;
    // cartExists.cartItems.forEach((item) => {
    //   totalCartPrice += item.price * item.quantity;
    // });
    calcTotalCartPrice(cartExists);
    await cartExists.save();
    res.status(201).json({ msg: "success", cartExists });
    // =================================|my code|====================================|
    // let flag = false;
    // for (const item of cartExists.cartItems) {
    //   if (item.product.toString() === req.body.product) {
    //     if (req.body?.quantity && product.stock >= req.body?.quantity) {
    //       item.quantity = req.body.quantity;
    //     } else if (product.stock > item.quantity) {
    //       ++item.quantity;
    //     } else {
    //       return next(new AppError("product Not available", 404));
    //     }
    //     await cartExists.save();
    //     flag = true;
    //     return res.status(201).json({ msg: "success", cartExists });
    //   }
    // }
    // if (!flag) {
    //   cartExists.cartItems.push(req.body);
    //   await cartExists.save();
    //   cartExists && res.status(201).json({ msg: "success", cartExists });
    // }
  }
});
export { calcTotalCartPrice, cartMW };
