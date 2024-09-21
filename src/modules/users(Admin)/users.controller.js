import { User } from "../../../models/user.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";


// ~=====================================|get All Users (Admin)|===================================================
const getAllUsers = errorHandler(async (req, res, next) => {
  if (req.sysUser.role !== "Admin")
    return next(new AppError("User Not Authorized", 401));
  const users = await User.find();
  if (users.length) {
    res.json({
      msg: "success",
      users,
    });
  } else {
    next(new AppError("Users Not found", 404));
  }
});
// ~=====================================|get specific User (Admin)|===================================================
const getSpecificUser = errorHandler(async (req, res, next) => {
  if (req.sysUser.role !== "Admin")
    return next(new AppError("User Not Authorized", 401));
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      msg: "success",
      user,
    });
  } else {
    next(new AppError("User Not found", 404));
  }
});
// ~=====================================|update User (Admin)|===================================================
const updateUser_Admin = errorHandler(async (req, res, next) => {
  if (req.sysUser.role !== "Admin")
    return next(new AppError("User Not Authorized", 401));
  const { firstName, lastName, username, email, recoveryEmail, mobileNumber } =
    req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName,
      lastName,
      username,
      email,
      recoveryEmail,
      mobileNumber,
    },
    {
      new: true,
    }
  );
  user && res.json({ msg: "success", user });
  user || next(new AppError("User Not Authorized", 401));
});
// ~=====================================|change User Password (Admin)|===================================================
const changeUserPass_Admin = errorHandler(async (req, res, next) => {
  if (req.sysUser.role !== "Admin")
    return next(new AppError("User Not Authorized", 401));
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { password: req.body.newPassword, status: "offline" },
    {
      new: true,
    }
  );
  if (!user) {
    return new AppError(
      "User Not found, plz check your input and try again",
      404
    );
  }
  res.json({ msg: "success", user });
});
// ~=====================================|delete User (Admin)|===================================================
const deleteUser_Admin = errorHandler(async (req, res, next) => {
  if (req.sysUser.role !== "Admin")
    return next(new AppError("User Not Authorized", 401));
  const user = await User.findByIdAndDelete(req.params.id);
  // check user role
  // if (user?.role == "Company_HR") {
  //   // finding all jobs posted by HR
  //   const jobs = await Job.find({ addedBy: user._id });
  //   for (const job of jobs) {
  //     // deleting all related jobs applications
  //     await Application.deleteMany({ jobID: job._id });
  //   }
  //   // deleting all jobs posted by HR
  //   await Job.deleteMany({ addedBy: user._id });
  //   res.status(200).json({ msg: "user deleted successfully", user });
  // } else {
  //   // if user role is not Company_HR
  //   // finding all applications submitted by user
  //   const applications = await Application.find({ userID: user._id });
  //   for (const application of applications) {
  //     // deleting all related user applications
  //     await Application.deleteMany({ _id: application._id });
  //   }
  //   res.status(200).json({ msg: "user deleted successfully", user });
  // }
  user && res.status(200).json({ msg: "user deleted successfully", user });
  user ?? next(new AppError("user not found", 404));
});
// ~=====================================|get Users by recovery email|===================================================
const getUsersByRecoveryMail = errorHandler(async (req, res, next) => {
  if (req.sysUser.role !== "Admin")
    return next(new AppError("User Not Authorized", 401));
  const users = await User.find({ recoveryEmail: req.query.recoveryEmail });
  if (users.length == 0) {
    return next(new AppError("no users found for this recovery Email", 404));
  }
  res.status(200).json({
    msg: "success",
    users,
  });
});
export {
  getSpecificUser,
  updateUser_Admin,
  deleteUser_Admin,
  getAllUsers,
  changeUserPass_Admin,
  getUsersByRecoveryMail,
};
