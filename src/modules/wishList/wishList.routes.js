import { Router } from "express";
import * as wishListController from "./wishList.controller.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { addToWishListVal, deleteWishListVal } from "./wishList.validation.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";
import { wishListUpdateMW } from "../../middleWares/wishList/wishListUpdateMW.js";

const wishListRouter = Router();

wishListRouter
  .route("/")
  .patch(
    sysUserAuthMW(),
    allowedTo("User"),
    globalValidator(addToWishListVal),
    wishListUpdateMW,
    wishListController.addToWhishList
  )
  .get(
    sysUserAuthMW(),
    allowedTo("User"),
    wishListController.getLoggedUserWishList
  );
wishListRouter
  .route("/:id")
  .delete(
    sysUserAuthMW(),
    allowedTo("User"),
    globalValidator(deleteWishListVal),
    wishListController.removeFromWishList
  );

export default wishListRouter;
