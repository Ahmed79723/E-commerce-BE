import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { User } from "../../../models/user.model.js";

// ~=====================================|add To user addresses|===================================================
const addAddress = errorHandler(async (req, res, next) => {
  const userAddress = await User.findByIdAndUpdate(
    req.sysUser.userId,
    {
      $push: { addresses: req.body.address },
    },
    {
      new: true,
    }
  );
  // if address is added
  userAddress &&
    res.status(201).json({ msg: "success", address: userAddress.addresses });
  // if address not added
  userAddress || next(new AppError("address not added", 404));
});
// ~=====================================|remove from addresses|===================================================
const removeAddress = errorHandler(async (req, res, next) => {
  const userAddress = await User.findByIdAndUpdate(
    req.sysUser.userId,
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    {
      new: true,
    }
  );
  userAddress &&
    res.status(201).json({ msg: "success", address: userAddress.addresses });
  userAddress || next(new AppError("address not found", 404));
});
// ~=====================================|get Logged User Addresses|===================================================
const getLoggedUserAddresses = errorHandler(async (req, res, next) => {
  const userAddress = await User.findById(req.sysUser.userId);
  if (userAddress.addresses.length == 0)
    return next(new AppError("no addresses found for this user", 404));

  userAddress &&
    res.status(201).json({ msg: "success", address: userAddress.addresses });
  userAddress || next(new AppError("unknown err ocurred", 404));
});
export { addAddress, removeAddress, getLoggedUserAddresses };
