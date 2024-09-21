import { User } from "../../models/user.model.js";
import { AppError } from "../utils/appError.js";

// this Middleware is used to make sure user email and phone are unique
//and generate token upon user signup and
// using this token to encode certain user data later
const checkUserInfoExistence = async (req, res, next) => {
  let input = {};
  let flag = false;
  req.body.username
    ? (input.username = req.body.username)
    : req.body.email
    ? (input.email = req.body.email)
    : req.body.mobileNumber
    ? (input.mobileNumber = req.body.mobileNumber)
    : (flag = true);
  if (flag) return next();
  const user = await User.findOne({
    ...input,
  });
  if (user) {
    return next(new AppError(`user with same info already exists`, 409));
  }
  next();
};

export default checkUserInfoExistence;
