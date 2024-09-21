import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { User } from "../../../models/user.model.js";

// ~=====================================|add To WhishList|===================================================
const addToWhishList = errorHandler(async (req, res, next) => {
  const userWishList = await User.findByIdAndUpdate(
    req.sysUser.userId,
    {
      $addToSet: { wishList: req.body.product },
    },
    {
      new: true,
    }
  );
  // if product is added
  userWishList &&
    res.status(201).json({ msg: "success", wishList: userWishList.wishList });
  // if product not added
  userWishList || next(new AppError("product not added", 404));
});
// ~=====================================|remove from WhishList|===================================================
const removeFromWishList = errorHandler(async (req, res, next) => {
  const userWishList = await User.findByIdAndUpdate(
    req.sysUser.userId,
    {
      $pull: { wishList: req.params.id },
    },
    {
      new: true,
    }
  );
  userWishList &&
    res.status(201).json({ msg: "success", wishList: userWishList.wishList });
  userWishList || next(new AppError("product not found", 404));
});
// ~=====================================|get Logged User WishList|===================================================
const getLoggedUserWishList = errorHandler(async (req, res, next) => {
  const userWishList = await User.findById(req.sysUser.userId).populate(
    "wishList"
  );
  userWishList &&
    res.status(201).json({ msg: "success", wishList: userWishList.wishList });
  userWishList || next(new AppError("product not found", 404));
});
export { addToWhishList, removeFromWishList, getLoggedUserWishList };
