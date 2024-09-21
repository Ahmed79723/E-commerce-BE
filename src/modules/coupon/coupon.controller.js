import { Coupon } from "../../../models/coupon.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
//coupons Coupon  coupon

// ~=====================================|add coupon|===================================================
const addCoupon = errorHandler(async (req, res, next) => {
  const coupon = new Coupon(req.body);
  await coupon.save();
  // if coupon is added
  coupon && res.status(201).json({ msg: "success", coupon });
  // if coupon not added
  coupon || next(new AppError("coupon not added", 404));
});
// ~=====================================|Get all coupons|===================================================
const getAllCoupons = errorHandler(async (req, res, next) => {
  const coupons = await Coupon.find();
  // .populate({
  //   path: "Available_Jobs",
  //   populate: { path: "addedBy", select: "username-_id" },
  // });
  coupons.length && res.json({ msg: "success", coupons });
  coupons.length || next(new AppError("coupons not found", 404));
});
// ~=====================================|Get coupon|===================================================
const getCoupon = errorHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  // .populate({
  //   path: "Available_Jobs",
  // });
  // if coupon found
  coupon && res.json({ msg: "success", coupon });
  // if coupon data not found
  coupon || next(new AppError("coupon not found", 404));
});
// ~=====================================|update coupon|===================================================
const updateCoupon = errorHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  coupon && res.status(201).json({ msg: "success", coupon });
  coupon || next(new AppError("coupon not found", 404));
});
// ~=====================================|delete coupon|===================================================
const deleteCoupon = errorHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (coupon) {
    // const jobs = await Job.find({});
    // for (const job of jobs) {
    //   await Application.deleteMany({ jobID: job._id });
    // }
    // await Job.deleteMany({});
    res.status(200).json({ msg: "coupon deleted", coupon });
  }
  coupon ?? next(new AppError(`coupon not found`, 404));
});
// ~=====================================|search coupon|===================================================
// const searchCoupon = errorHandler(async (req, res, next) => {
//   const { couponName } = req.query;
//   // Check if search query parameter is provided
//   if (!couponName) {
//     return next(new AppError(`search query parameter is required`, 400));
//   }
//   const companies = await Coupon.find({ ...req.query });
//   // show matched results if found
//   companies.length && res.status(200).json({ msg: "success", companies });
//   // if no companies found
//   companies.length || next(new AppError(`no companies found`, 404));
// });

export {
  addCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  // searchCoupon,
};
