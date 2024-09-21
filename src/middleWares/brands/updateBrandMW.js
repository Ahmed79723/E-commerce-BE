import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Brand } from "../../../models/brand.model.js";
import { errorHandler } from "../errorHandler.js";
import { AppError } from "../../utils/appError.js";

// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = dirname(__filename);

const updateBrandMW = errorHandler(async (req, res, next) => {
  if (req.file) {
    const brand = await Brand.findById(req.params.brandId);
    const logo = brand.logo.split("/");
    const logoName = logo[logo.length - 1];
    const filePath = path.join(
      __dirname,
      `../../../uploads/brands/${logoName}`
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

    req.body.logo = req.file.filename;
    return next();
  }
  next();
});
export default updateBrandMW;
