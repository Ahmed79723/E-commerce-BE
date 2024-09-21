//! =====================================|programmatic error handling|===================================================
process.on("uncaughtException", (err) => {
  console.log("error in code", err);
});
import express from "express";
import { globalErrorMW } from "./src/middleWares/globalErrorMW.js";
import { User } from "./models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "./src/utils/appError.js";
import { emailToken797 } from "./src/email/email.js";
import { globalRoutes } from "./src/modules/globalRoutes.js";
import { imagesCleanerMW } from "./src/middleWares/imagesCleanerMW.js";
import cors from "cors";
import { dbConnection } from "./dataBase/dbConnection.js";
// import dotenv from "dotenv"
// dotenv.config({path:""})
import "dotenv/config";
const app = express();
const port = process.env.PORT || 3011;
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
globalRoutes(app);
app.use("/uploads", express.static("uploads"));
// process.env.myName="ahmed"
imagesCleanerMW();
//? =====================================|end points for user email confirmation|===================================================
// if user choose to confirm email by clicking on confirm email button
app.get("/verify/:token", async (req, res, next) => {
  // 1-verify token received from sendEmails function
  jwt.verify(req.params.token, "emailConfirmToken", async (err, decoded) => {
    if (err) return next(new AppError(err, 404));
    // 2-try to find user using the encoded email form sent token then update the confirmEmail key to true
    // 3-if user forgot pass we update the pass to the new one ,sent thru the decoded extraInfo obj from emailConfirmToken
    // and this is optional because if there was no newPassword received we keep the old pass.
    await User.findOneAndUpdate(
      { email: decoded.email },
      {
        confirmEmail: true,
        otp: undefined,
        otpExpire: undefined,
        password:
          bcrypt.hashSync(decoded.extraInfo.newPassword, 8) ||
          decoded.userF.password,
      }
    );
    res.json({ msg: "Success", email: decoded.email });
  });
});
// *---------------------------------------------------------------------------------------------------
// if user choose to confirm email otp from sent email ,
// and everything is the same as the above button email confirmation
app.get("/verify/otp/:otp", async (req, res, next) => {
  // 1-check token bearer imported from the sendEmail function
  const [bearer, core] = emailToken797.split(" ");
  if (bearer === "emailConfirmToken") {
    jwt.verify(core, "emailConfirmToken", async (err, decoded) => {
      if (err) return next(new AppError(err, 404));
      // 2-try to find user using otp form sent email then
      // update the confirmEmail and password if user requested to do so.
      const { otp } = req.params;
      const user = await User.findOne({ otp });
      if (!user) return res.status(404).json({ msg: "invalid otp" });
      //3- check if the sent otp is valid or expired
      if (user.otpExpire > Date.now()) {
        await User.updateOne(
          { otp },
          {
            confirmEmail: true,
            otp: null,
            otpExpire: null,
            password:
              bcrypt.hashSync(decoded.extraInfo.newPassword, 8) ||
              decoded.userF.password,
          }
        );
        res.json({ msg: "Success", email: user.email });
      } else {
        res.status(404).json({ msg: "otp Expired, Plz Try Again" });
      }
    });
  } else {
    res.status(404).json({ msg: "wrong token bearer from index" });
  }
});
//? =====================================|default end point|===================================================
app.get("/", (req, res) => res.send("Welcome to My Job Search App"));
//^ =====================================|404 end point|===================================================
app.use(
  "*",
  (req, res, next) =>
    next(new AppError(`route not found ${req.originalUrl}`, 404))
  // res.status(404).json({ msg: `route not found ${req.originalUrl}` })
  //^ new AppError(`route not found ${req.originalUrl}`,404)
  //^ this line is the error that is passed to the major where i receive it in the err param of error middle ware
);
//! =====================================|global error handler MW|===================================================
app.use(globalErrorMW);
//! =====================================|error handling outside express|===================================================
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection", err);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
