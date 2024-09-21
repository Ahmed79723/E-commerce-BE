import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import couponMW from "../../middleWares/coupons/couponMW.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { addCouponVal, updateCouponVal } from "./coupon.validation.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";
import { verifyToken } from "../../middleWares/verifyToken.js";

const couponRouter = Router();
couponRouter.use(sysUserAuthMW(), allowedTo("Admin"));
couponRouter.route("/").get(couponController.getAllCoupons).post(
  couponMW,
  // globalValidator(addCouponVal),
  couponController.addCoupon
);
couponRouter
  .route("/:id")
  .get(couponController.getCoupon)
  .put(
    // globalValidator(updateCouponVal),
    couponController.updateCoupon
  )
  .delete(couponController.deleteCoupon);
//? =====================================|search coupon|===================================================
// couponRouter.get(
//   "/searchCoupon",
//   globalValidator(updateCouponVal),
//   couponController.searchCoupon
// );

export default couponRouter;
