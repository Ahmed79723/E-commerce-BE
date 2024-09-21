import slugify from "slugify";
import { Brand } from "../../../models/brand.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
//brands Brand brand

// ~=====================================|add brand|===================================================
const addBrand = errorHandler(async (req, res, next) => {
  req.body.logo = req.file.filename;
  const brand = new Brand(req.body);
  brand.slug = slugify(brand.name);
  await brand.save();
  // if brand is added
  brand && res.status(201).json({ msg: "success", brand });
  // if brand not added
  brand || next(new AppError("brand not added", 404));
});
// ~=====================================|Get all brands.|===================================================
const getAllBrands = errorHandler(async (req, res, next) => {
  const brands = await Brand.find();
  // .populate({
  //   path: "Available_Jobs",
  //   populate: { path: "addedBy", select: "username-_id" },
  // });
  brands.length && res.json({ msg: "success", brands });
  brands.length || next(new AppError("brands not found", 404));
});
// ~=====================================|Get brand|===================================================
const getBrand = errorHandler(async (req, res, next) => {
  const brand = await Brand.findOne(req.params);
  // .populate({
  //   path: "Available_Jobs",
  // });
  // if brand found
  brand && res.json({ msg: "success", brand });
  // if brand data not found
  brand || next(new AppError("brand not found", 404));
});
// ~=====================================|update brand|===================================================
const updateBrand = errorHandler(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  const brand = await Brand.findByIdAndUpdate(req.params.brandId, req.body, {
    new: true,
  });
  brand && res.status(201).json({ msg: "success", brand });
  brand || next(new AppError("brand not found", 404));
});
// ~=====================================|delete brand|===================================================
const deleteBrand = errorHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.brandId);
  if (brand) {
    // const jobs = await Job.find({});
    // for (const job of jobs) {
    //   await Application.deleteMany({ jobID: job._id });
    // }
    // await Job.deleteMany({});
    res.status(200).json({ msg: "brand deleted", brand });
  }
  brand ?? next(new AppError(`brand not found`, 404));
});
// ~=====================================|search brand|===================================================
// const searchBrand = errorHandler(async (req, res, next) => {
//   const { brandName } = req.query;
//   // Check if search query parameter is provided
//   if (!brandName) {
//     return next(new AppError(`search query parameter is required`, 400));
//   }
//   const companies = await brand.find({ ...req.query });
//   // show matched results if found
//   companies.length && res.status(200).json({ msg: "success", companies });
//   // if no companies found
//   companies.length || next(new AppError(`no companies found`, 404));
// });

export {
  addBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  // searchBrand,
};
