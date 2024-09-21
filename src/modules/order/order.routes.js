import { Router } from "express";
import * as orderController from "./order.controller.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
// import { addToorderVal, deleteFromorderVal } from "./order.validation.js";

const orderRouter = Router({ mergeParams: true });
orderRouter
  .route("/")
  .get(
    sysUserAuthMW(),
    allowedTo("User", "Admin"),
    orderController.getUserOrders
  )
  .post(sysUserAuthMW(), allowedTo("User"), orderController.createCashOrder);
orderRouter.get(
  "/getAllOrders",
  sysUserAuthMW(),
  allowedTo("Admin"),
  orderController.getAllOrders
);
orderRouter.post(
  "/checkout/:id",
  sysUserAuthMW(),
  allowedTo("User"),
  orderController.createCheckoutSession
);

// orderRouter.route("/:id").post(
//   // globalValidator(deleteFromorderVal),
//   orderController.updateQuantity
// );

export default orderRouter;
