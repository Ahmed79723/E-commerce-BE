import { Router } from "express";
import * as categoryController from "./category.controller.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { uploadSingleFile } from "../../file upload/fileUpload.js";
import updateCatMW from "../../middleWares/updateCatMW.js";
import { addCatVal, updateCatVal } from "./category.validation.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { allowedTo, sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";

const categoryRouter = Router();
//? =====================================|add Category|===================================================
categoryRouter
  .route("/")
  .post(
    sysUserAuthMW(),
    allowedTo("Admin", "User"),
    uploadSingleFile("image", "categories"),
    globalValidator(addCatVal),
    categoryController.addCategory
  )
  .get(categoryController.getAllCategories);
//? =====================================|get Category|===================================================
categoryRouter.get("/:slug", categoryController.getCategory);
categoryRouter
  .route("/:id")
  .put(
    sysUserAuthMW(),
    allowedTo("Admin", "User"),
    uploadSingleFile("image", "categories"),
    globalValidator(updateCatVal),
    updateCatMW,
    categoryController.updateCategory
  )
  .delete(sysUserAuthMW(), categoryController.deleteCategory);
categoryRouter.use(
  "/:category/subCategories",
  sysUserAuthMW(),
  allowedTo("Admin", "User"),
  subCategoryRouter
);
//& =====================================|global MWs|===================================================

export default categoryRouter;
