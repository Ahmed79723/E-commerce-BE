import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";
import { AppError } from "../utils/appError.js";
import { User } from "../../models/user.model.js";
import { sendEmails } from "../email/email.js";

// this middle ware is used to make sure only accounts with roles in ["User","Company_Hr"]
// are the only ones who can access the system end points
const sysUserAuthMW = (req, res, next, T_ID) => {
  return errorHandler(async (req, res, next) => {
    // check end point headers for token existence
    req.headers.token ?? next(new AppError("No token, plz Log In again", 404));
    // extract the token bearer and core after validating token existence
    const [bearer, token] = req.headers?.token?.split(" ");
    //? Token bearer check
    if (bearer == process.env.JWT_KEY) {
      // verify headers signInToken
      jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) return res.status(404).json({ msg: "invalid token", err });
        // storing token decoded data in req to send it to controllers for later use
        req.sysUser = decoded;

        // declaring an input variable to use it later in finding the encoded user in token
        if (!req.sysUser.name) {
          return next(new AppError("no user found for this token", 404));
        }
        // use decoded data to find a user and check his status
        const match = await User.findById(decoded.userId);
        if (!match) {
          return next(new AppError("User Not Found", 404));
        }

        if (match?.status == "offline")
          return next(
            new AppError(
              "User Not online!! , plz login first and try again",
              401
            )
          );
        let time = parseInt(match?.changePass?.getTime() / 1000);
        // console.log("token createdAT", decoded.iat);
        // console.log("user changePass", time);
        if (time > decoded.iat) {
          // console.log("22");
          return next(new AppError("invalid token!...plz login again", 401));
        }
        // use decoded data to find a user and check his id against decoded userId from token
        // to avoid token manipulation
        if (match?._id == decoded.userId) {
          req.validMWUser = match;
          return next();
        }
      });
    } else {
      next(new AppError("wrong token bearer", 409));
    }
  });
};
// !===================================|allowed|===================================
const allowedTo = (...roles) => {
  return errorHandler(async (req, res, next) => {
    if (roles.includes(req.sysUser.role)) {
      return next();
    }
    return next(new AppError("not allowed to perform this action", 403));
  });
};
export { sysUserAuthMW, allowedTo };
