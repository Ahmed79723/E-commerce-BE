import slugify from "slugify";
import { Category } from "../../../models/category.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

// ~=====================================|add category|===================================================
const addCategory = errorHandler(async (req, res, next) => {
  // req.body.slug = slugify(req.body.name);
  req.body.image = req.file?.filename ?? undefined;
  const category = new Category(req.body);
  category.slug = slugify(category.name);
  await category.save();
  // if category is added
  category && res.status(201).json({ msg: "success", category });
  // if category not added
  category || next(new AppError("category not added", 404));
});
//~=====================================|Get all categories|===================================================
const getAllCategories = errorHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .pagination()
    .select()
    .search()
    .sort()
    .filter();
  let categories = await apiFeatures.mongooseQuery;
  // show matched results if found
  categories.length &&
    res.status(200).json({
      msg: "success",
      page: apiFeatures.page,
      limit: apiFeatures.limit,
      categories,
    });
  categories.length || next(new AppError("categories not found", 404));
});
// ~=====================================|get Category|===================================================
const getCategory = errorHandler(async (req, res, next) => {
  const category = await Category.findOne(req.params);
  // if applications are found
  category && res.status(200).json({ msg: "success", category });
  // if no category found
  category || next(new AppError(`no category found`, 404));
});
// ~=====================================|update category|===================================================
const updateCategory = errorHandler(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
    }
  );
  // if categories is updated
  category && res.status(201).json({ msg: "success", category });
  // if categories is not updated
  category || next(new AppError("category not found", 404));
});
// ~=====================================|delete category|===================================================
const deleteCategory = errorHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);
  category ?? next(new AppError(`category not found`, 404));
  category && res.status(200).json({ msg: "category deleted", category });
});

export {
  addCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
