import { Router } from "express";
import * as reviewController from "./review.controller.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { addReviewVal, updateReviewVal } from "./review.validation.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
// import updatereviewMW from "../../middleWares/reviews/updatereviewMW.js";

const reviewRouter = Router();

reviewRouter
  .route("/")
  .post(
    sysUserAuthMW(),
    allowedTo("User"),
    globalValidator(addReviewVal),
    reviewController.addReview
  )
  .get(reviewController.getAllReviews);
reviewRouter.get("/:id", reviewController.getReview);
reviewRouter
  .route("/:id")
  .put(
    sysUserAuthMW(),
    allowedTo("Admin", "User"),
    globalValidator(updateReviewVal),
    // updatereviewMW,
    reviewController.updateReview
  )
  .delete(
    sysUserAuthMW(),
    allowedTo("Admin", "User"),
    reviewController.deleteReview
  );
//& =====================================|global MW|===================================================
// reviewRouter.use(verifyToken("", "", "", TID));

export default reviewRouter;
