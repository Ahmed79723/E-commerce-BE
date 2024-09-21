import { Category } from "../../models/category.model.js";
import { errorHandler } from "./errorHandler.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { AppError } from "../utils/appError.js";

// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = dirname(__filename);

const updateCatMW = errorHandler(async (req, res, next) => {
  if (req.file) {
    const category = await Category.findById(req.params.categoryId);
    const image = category.image.split("/");
    const imgName = image[image.length - 1];
    const filePath = path.join(
      __dirname,
      `../../uploads/categories/${imgName}`
    );

    async function deleteFile() {
      try {
        await fs.promises.unlink(filePath);
        console.log("File deleted successfully");
      } catch (err) {
        return next(new AppError(err, 500));
        // console.error("Error deleting file:", err);
      }
    }

    deleteFile();

    req.body.image = req.file.filename;
    return next();
  }
  next();
});
export default updateCatMW;
