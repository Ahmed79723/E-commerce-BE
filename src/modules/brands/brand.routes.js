import { Router } from "express";
import * as brandController from "./brand.controller.js";
import { uploadSingleFile } from "../../file upload/fileUpload.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";
import updateBrandMW from "../../middleWares/brands/updateBrandMW.js";
import { addBrandVal, updateBrandVal } from "./brand.validation.js";

const brandRouter = Router();

brandRouter
  .route("/")
  .post(
    uploadSingleFile("logo", "brands"),
    globalValidator(addBrandVal),
    brandController.addBrand
  )
  .get(brandController.getAllBrands);
brandRouter.get("/:slug", brandController.getBrand);
brandRouter
  .route("/:id")
  .put(
    uploadSingleFile("logo", "brands"),
    globalValidator(updateBrandVal),
    updateBrandMW,
    brandController.updateBrand
  )
  .delete(brandController.deleteBrand);
//& =====================================|global MW|===================================================
// brandRouter.use(verifyToken("", "", "", TID));
//? =====================================|search brand|===================================================
// brandRouter.get(
//   "/searchBrand",
//   globalValidator(updateBrandVal),
//   brandController.searchBrand
// );

export default brandRouter;
