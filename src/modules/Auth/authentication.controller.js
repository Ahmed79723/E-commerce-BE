import { User } from "../../../models/user.model.js";
import { sendEmails } from "../../email/email.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import bcrypt from "bcrypt";

// ~=====================================|get logged User Data|===================================================
const getUserData = errorHandler(async (req, res, next) => {
  // to make sure only the owner of the account can get his account data
  if (req.params.id == req.sysUser.userId) {
    const user = await User.findById(req.params.id);
    res.json({ msg: "success", user });
  }
  return next(new AppError("User Not Authorized", 401));
});
// ~=====================================|signup|===================================================
const signup = errorHandler(async (req, res, next) => {
  const randomOtp = Math.floor(100000 + Math.random() * 900000);
  const user = new User({
    ...req.body,
    otp: randomOtp,
    otpExpire: Date.now() + 60000,
  });
  await user.save();
  if (user) {
    sendEmails(req.body.email, req.body.username, randomOtp);
    user.password = undefined;
    res.status(201).json({ msg: "success", user });
  } else {
    return next(new AppError(`User Not Added`, 401));
  }
});
// ~=====================================|signin|===================================================
const signin = errorHandler(async (req, res) => {
  res.status(200).json({
    msg: `Welcome back ${req.body.username}`,
    _id: req.body._id,
    token: req.body.token,
  });
});
// ~=====================================|update logged User|===================================================
const updateUser = errorHandler(async (req, res, next) => {
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
// ~=====================================|delete logged User|===================================================
const deleteUser = errorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  // check user role
  if (user?.role == "Admin") {
    // finding all jobs posted by HR
    // const jobs = await Job.find({ addedBy: user._id });
    // for (const job of jobs) {
    // deleting all related jobs applications
    // await Application.deleteMany({ jobID: job._id });
    // }
    // deleting all jobs posted by HR
    // await Job.deleteMany({ addedBy: user._id });
    res.status(200).json({ msg: "user deleted successfully", user });
  } else {
    // if user role is not Company_HR
    // finding all applications submitted by user
    // const applications = await Application.find({ userID: user._id });
    // for (const application of applications) {
    // deleting all related user applications
    // await Application.deleteMany({ _id: application._id });
    // }
    res.status(200).json({ msg: "user deleted successfully", user });
  }
  user ?? next(new AppError("user not found", 404));
});
// ~=====================================|get another User info|===================================================
// const getUsersInfo = errorHandler(async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   // creating an objects for public data from found user and hiding sensitive info
//   if (user) {
//     res.json({
//       msg: "success",
//       user: {
//         firstName: user.firstName,
//         lastName: user.lastName,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } else {
//     next(new AppError("User Not found", 404));
//   }
// });
// ~=====================================|change logged User Password|===================================================
const changeUserPass = errorHandler(async (req, res, next) => {
  if (bcrypt.compareSync(req.body.oldPassword, req.validMWUser.password)) {
    const user = await User.findByIdAndUpdate(
      req.sysUser.userId,
      {
        password: req.body.newPassword,
        changePass: Date.now(),
        status: "offline",
      },
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
    return res.json({ msg: "success", user });
  }
  next(new AppError("incorrect password", 401));
});

export {
  getUserData,
  signup,
  signin,
  updateUser,
  deleteUser,
  // getUsersInfo,
  changeUserPass,
};
