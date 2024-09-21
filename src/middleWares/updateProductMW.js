import { Brand } from "../../models/brand.model.js";
import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import { SubCategory } from "../../models/subCategory.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = dirname(__filename);

export const updateProductMW = errorHandler(async (req, res, next) => {
  let { category, subCategory, brand } = req.body;
  // body provided ids by user
  const dbCategory = await Category.findById(category);
  const dbSubCategory = await SubCategory.findById(subCategory);
  const dbBrand = await Brand.findById(brand);
  // if user did not enter any of the following fields,ignore and go to next
  if (!category && !subCategory && !brand) {
    if (!req.files?.coverImage || !req.files?.images) {
      return next();
    }
  }
  // if user entered data in the body
  else if (category || subCategory || brand) {
    if (category && !dbCategory) {
      return next(new AppError("category not found", 404));
    } else if (subCategory && !dbSubCategory) {
      return next(new AppError("subCategory not found", 404));
    } else if (brand && !dbBrand) {
      return next(new AppError("brand not found", 404));
    } else if (!req.files?.coverImage || !req.files?.images) {
      return next();
    }
  }
  //! =======================|deleting old photos after updating them|==========================
  //* -----------|deleting coverImage image|----------------
  const product = await Product.findById(req.params.productId);
  if (req.files && product) {
    console.log("mw-new", req.files);
    if (req.files.coverImage) {
      const coverImage = product.coverImage.split("/");
      const coverImageName = coverImage[coverImage.length - 1];
      const filePath = path.join(
        __dirname,
        `../../uploads/products/${coverImageName}`
      );

      async function deleteFile() {
        try {
          await fs.promises.unlink(filePath);
          console.log("File deleted successfully");
        } catch (err) {
          return next(new AppError(err, 500));
        }
      }

      deleteFile();
    }
    //* -----------|deleting array of images|----------------
    if (req.files.images) {
      product.images.map((img) => {
        const image = img.split("/");
        const imageName = image[image.length - 1];
        const filePath = path.join(
          __dirname,
          `../../uploads/products/${imageName}`
        );
        async function deleteFiles() {
          try {
            await fs.promises.unlink(filePath);
            console.log("File deleted successfully");
          } catch (err) {
            return next(new AppError(err, 500));
            // console.error("Error deleting file:", err);
          }
        }

        deleteFiles();
      });
    }

    req.body.coverImage = req.files.coverImage[0].filename;
    req.body.images = req.files.images.map((img) => img.filename);
    return next();
  } else {
    req.body.coverImage = req.files.coverImage[0].filename;
    req.body.images = req.files.images.map((img) => img.filename);
    return next();
  }
});
