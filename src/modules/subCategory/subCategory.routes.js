import { Router } from "express";
import * as subCategoryController from "./subCategory.controller.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { subCatMW } from "../../middleWares/subCatMW.js";
import {
  addSubCategoryVal,
  updateSubCategoryVal,
} from "./subCategory.validation.js";
import { uploadSingleFile } from "../../file upload/fileUpload.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
import { sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";

const subCategoryRouter = Router({ mergeParams: true });

//? =====================================|add subCategory|===================================================
subCategoryRouter
  .route("/")
  .get(
    subCategoryController.getAllSubCategories
  )
  .post(
    uploadSingleFile("image", "subCategories"),
    globalValidator(addSubCategoryVal),
    subCatMW,
    subCategoryController.addSubCategory
  );
subCategoryRouter.get("/:slug", subCategoryController.getSubCategory);
subCategoryRouter
  .route("/:id")
  .put(
    globalValidator(updateSubCategoryVal),
    subCatMW,
    subCategoryController.updateSubCategory
  )
  .delete(subCategoryController.deleteSubCategory);
//& =====================================|global MWs|===================================================

export default subCategoryRouter;
