import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import { cartMW } from "../../middleWares/cart/cartMW.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
// import { addToCartVal, deleteFromCartVal } from "./cart.validation.js";

const cartRouter = Router();
cartRouter.use(sysUserAuthMW(), allowedTo("User"));
cartRouter
  .route("/")
  .post(cartMW, cartController.addToCart)
  .get(cartController.getLoggedUserCart)
  .delete(cartController.clearUserCart);
cartRouter
  .route("/:id")
  .put(
    // globalValidator(deleteFromCartVal),
    cartController.updateQuantity
  )
  .delete(
    // globalValidator(deleteFromCartVal),
    cartController.removeCartItem
  );
cartRouter.post("/apply-coupon", cartController.applyCoupon);
export default cartRouter;
