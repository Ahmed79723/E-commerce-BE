import { Router } from "express";
import * as authController from "./authentication.controller.js";
import {
  signinUserVerify,
  TID,
} from "../../middleWares/signinUserVerifyToken.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { ForgetPassMW } from "../../middleWares/forgetPassMW.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import checkUserInfoExistence from "../../middleWares/checkUserInfoExistence.js";
import * as userValSchemas from "../users(Admin)/usersValidation.js";
import orderRouter from "../order/order.routes.js";
import { verifyToken } from "../../middleWares/verifyToken.js";

const authRouter = Router();
// ?=====================================|signup|===================================================
authRouter.post(
  "/signup",
  globalValidator(userValSchemas.sigUpValSchema),
  checkUserInfoExistence,
  authController.signup
);
// ?=====================================|signin|===================================================
authRouter.post(
  "/signin",
  globalValidator(userValSchemas.sigInValSchema),
  signinUserVerify,
  authController.signin
);
// &=====================================|global MW|===================================================
authRouter.use(sysUserAuthMW());
// ?=====================================|get logged User data|===================================================
authRouter.get(
  "/getData/:id",
  globalValidator(userValSchemas.updateValSchema),
  authController.getUserData
);
// ?=====================================|get Users info|===================================================
// authRouter.get(
//   "/getUsersInfo/:id",
//   globalValidator(userValSchemas.updateValSchema),
//   authController.getUsersInfo
// );
// ?=====================================|user Forget Pass|===================================================
authRouter.post(
  "/forgetPass/:id",
  globalValidator(userValSchemas.forgetPassValSchema),
  ForgetPassMW
);
// ?=====================================|update logged User|===================================================
authRouter.put(
  "/update/:id",
  globalValidator(userValSchemas.updateValSchema),
  checkUserInfoExistence,
  authController.updateUser
);
// ?=====================================|change logged User Pass|===================================================
authRouter.patch(
  "/change-Password",
  globalValidator(userValSchemas.changePassValSchema),
  authController.changeUserPass
);
// ?=====================================|delete logged User|===================================================
authRouter.delete(
  "/delete/:id",
  globalValidator(userValSchemas.updateValSchema),
  authController.deleteUser
);
// ?=====================================|order merge param|===================================================
authRouter.use(
  "/:id/orders",
  allowedTo("User"),
  orderRouter
);
export default authRouter;
