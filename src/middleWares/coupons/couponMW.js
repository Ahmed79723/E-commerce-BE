import { Coupon } from "../../../models/coupon.model.js";
import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../errorHandler.js";

const couponMW = errorHandler(async (req, res, next) => {
  const isExists = await Coupon.findOne({ code: req.body.code });
  if (!isExists) {
    return next();
  }
  next(new AppError("Coupon already exists", 409));
});
export default couponMW;
