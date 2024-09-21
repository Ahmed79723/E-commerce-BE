import slugify from "slugify";
import { SubCategory } from "../../../models/subCategory.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

// ~=====================================|add subCategory|===================================================
const addSubCategory = errorHandler(async (req, res, next) => {
  const subCategory = new SubCategory(req.body);
  subCategory.slug = slugify(subCategory.name);
  await subCategory.save();
  subCategory && res.status(201).json({ msg: "success", subCategory });
  subCategory || next(new AppError("subCategory not added", 404));
});
// ~=====================================|Get all subCategories|===================================================
const getAllSubCategories = errorHandler(async (req, res, next) => {
  const reqParam = req.params ?? {};
  let apiFeatures = new ApiFeatures(SubCategory.find(reqParam), req.query)
    .pagination()
    .select()
    .search()
    .sort()
    .filter();
  let subCategories = await apiFeatures.mongooseQuery;
  // show matched results if found
  subCategories.length &&
    res.status(200).json({
      msg: "success",
      page: apiFeatures.page,
      limit: apiFeatures.limit,
      subCategories,
    });
  // if no subCategories found
  subCategories.length || next(new AppError(`no subCategories found`, 404));
});
// ~=====================================|get SubCategory|===================================================
const getSubCategory = errorHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findOne(req.params);
  subCategory && res.json({ msg: "success", subCategory });
  subCategory || next(new AppError("subCategory not found", 404));
});
// ~=====================================|update SubCategory|===================================================
const updateSubCategory = errorHandler(async (req, res, next) => {
  req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.subCategoryId,
    req.body,
    {
      new: true,
    }
  );
  subCategory && res.status(201).json({ msg: "success", subCategory });
  subCategory || next(new AppError("subCategory not found", 404));
});
//~=====================================|delete subCategory|===================================================
const deleteSubCategory = errorHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findByIdAndDelete(
    req.params.subCategoryId
  );
  if (subCategory) {
    // const applications = await SubCategory.find({
    //   subCategoryID: subCategory._id,
    // });
    // for (const application of applications) {
    //   await Application.deleteMany({ _id: application._id });
    // }
    res.status(200).json({ msg: "subCategory deleted", subCategory });
  }
  subCategory ?? next(new AppError(`subCategory not found`, 404));
});

export {
  addSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
