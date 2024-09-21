import { Router } from "express";
import * as productController from "./product.controller.js";
import { updateProductMW } from "../../middleWares/updateProductMW.js";
import { uploadMixOfFiles } from "../../file upload/fileUpload.js";
import { addProductVal, updateProductVal } from "./product.validation.js";
import globalValidator from "../../middleWares/globalValidator.js";
import { verifyToken } from "../../middleWares/verifyToken.js";
import { TID } from "../../middleWares/signinUserVerifyToken.js";
import { sysUserAuthMW } from "../../middleWares/sysUserAuthMW.js";

const productRouter = Router();

productRouter
  .route("/")
  .post(
    uploadMixOfFiles(
      [
        { name: "coverImage", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ],
      "products"
    ),
    globalValidator(addProductVal),
    updateProductMW,
    productController.addProduct
  )
  .get(productController.getAllProducts);
productRouter.get("/:slug", productController.getProduct);
productRouter
  .route("/:id")
  .put(
    uploadMixOfFiles(
      [
        { name: "coverImage", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ],
      "products"
    ),
    globalValidator(updateProductVal),
    updateProductMW,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);
//& =====================================|global MWs|===================================================

export default productRouter;
