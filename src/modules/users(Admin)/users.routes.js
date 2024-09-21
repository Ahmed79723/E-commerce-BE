import { Router } from "express";
import * as userController from "./users.controller.js";
// import {
//   signinUserVerify,
//   TID,
// } from "../../middleWares/signinUserVerifyToken.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { ForgetPassMW } from "../../middleWares/forgetPassMW.js";
import { sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import checkUserInfoExistence from "../../middleWares/checkUserInfoExistence.js";
import * as userValSchemas from "./usersValidation.js";
import { verifyToken } from "../../middleWares/verifyToken.js";

const userRouter = Router();

// &=====================================|global MW|===================================================
userRouter.use(sysUserAuthMW());
// ?=====================================|get All Users (Admin)|===================================================
userRouter.get(
  "/getAllUsers",
  userController.getAllUsers
);
// ?=====================================|get specific User (Admin)|===================================================
userRouter.get(
  "/getSpecificUser/:id",
  userController.getSpecificUser
);
// ?=====================================|update User (Admin)|===================================================
userRouter.put(
  "/update/:id",
  globalValidator(userValSchemas.updateValSchema),
  checkUserInfoExistence,
  userController.updateUser_Admin
);
// ?=====================================|change User Pass (Admin)|===================================================
userRouter.patch(
  "/change-Password/:id",
  globalValidator(userValSchemas.changePassValSchema),
  userController.changeUserPass_Admin
);
// ?=====================================|delete User (Admin)|===================================================
userRouter.delete(
  "/delete/:id",
  globalValidator(userValSchemas.updateValSchema),
  userController.deleteUser_Admin
);
// ?=====================================|get Users By Recovery Email|===================================================
userRouter.get(
  "/getUsersByRecoveryEmail",
  globalValidator(userValSchemas.userRecoveryEmailValSchema),
  userController.getUsersByRecoveryMail
);

export default userRouter;
