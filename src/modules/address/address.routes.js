import { Router } from "express";
import * as addressController from "./address.controller.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { addAddressVal, deleteAddressVal } from "./address.validation.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";

const addressRouter = Router();

addressRouter
  .route("/")
  .patch(
    sysUserAuthMW(),
    allowedTo("User"),
    globalValidator(addAddressVal),
    addressController.addAddress
  )
  .get(
    sysUserAuthMW(),
    allowedTo("User"),
    addressController.getLoggedUserAddresses
  );
addressRouter
  .route("/:id")
  .delete(
    sysUserAuthMW(),
    allowedTo("User"),
    globalValidator(deleteAddressVal),
    addressController.removeAddress
  );

export default addressRouter;
