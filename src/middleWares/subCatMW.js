import { Category } from "../../models/category.model.js";
import { AppError } from "../utils/appError.js";
import { errorHandler } from "./errorHandler.js";

export const subCatMW = errorHandler(async (req, res, next) => {
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    category && next();
    category ?? next(new AppError("category Not found", 404));
  } else {
    next();
  }
});
