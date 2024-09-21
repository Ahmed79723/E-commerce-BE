import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { Review } from "../../../models/review.model.js";
//Reviews Review review reviews

// ~=====================================|add Review|===================================================
const addReview = errorHandler(async (req, res, next) => {
  const review = new Review(req.body);
  review.user = req.validMWUser.id;
  const isExists = await Review.findOne({
    user: req.validMWUser.id,
    productId: req.body.productId,
  });
  if (isExists)
    return next(
      new AppError("can not create more than one comment per product", 409)
    );
  await review.save();
  // if Review is added
  review && res.status(201).json({ msg: "success", review });
  // if Review not added
  review || next(new AppError("Review not added", 404));
});
// ~=====================================|Get all Reviews|===================================================
const getAllReviews = errorHandler(async (req, res, next) => {
  const review = await Review.find();
  // .populate({
  //   path: "Available_Jobs",
  //   populate: { path: "addedBy", select: "username-_id" },
  // });
  review.length && res.json({ msg: "success", review });
  review.length || next(new AppError("Reviews not found", 404));
});
// ~=====================================|Get Review|===================================================
const getReview = errorHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  // .populate({
  //   path: "Available_Jobs",
  // });
  // if Review found
  review && res.json({ msg: "success", review });
  // if Review data not found
  review || next(new AppError("Review not found", 404));
});
// ~=====================================|update Review|===================================================
const updateReview = errorHandler(async (req, res, next) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.sysUser.userId },
    req.body,
    {
      new: true,
    }
  );
  review && res.status(201).json({ msg: "success", review });
  review ||
    next(
      new AppError(
        "Review not found or you haven't created a review before",
        404
      )
    );
});
// ~=====================================|delete Review|===================================================
const deleteReview = errorHandler(async (req, res, next) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    user: req.sysUser.userId,
  });
  if (review) {
    // const jobs = await Job.find({});
    // for (const job of jobs) {
    //   await Application.deleteMany({ jobID: job._id });
    // }
    // await Job.deleteMany({});
    res.status(200).json({ msg: "Review deleted", review });
  }
  review ?? next(new AppError(`Review not found`, 404));
});

export { addReview, updateReview, deleteReview, getAllReviews, getReview };
