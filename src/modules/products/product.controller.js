import slugify from "slugify";
import { Product } from "../../../models/product.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

// ~=====================================|add product|===================================================
const addProduct = errorHandler(async (req, res, next) => {
  req.body.coverImage = req.files?.coverImage[0]?.filename;
  req.body.images = req.files?.images.map((img) => img.filename);
  req.body.slug = slugify(req.body.title);
  const product = new Product(req.body);
  await product.save();
  product && res.status(201).json({ msg: "success", product });
  product || next(new AppError("product not added", 404));
});
// ~=====================================|Get all products|===================================================
const getAllProducts = errorHandler(async (req, res, next) => {
  //? ==================1-Pagination====================
  // let { page = 1, limit = 5 } = req.query;
  // page = req.query.page * 1 || 1;
  // page < 0 ? (page = 1) : page;
  // limit > 50 ? (limit = 5) : limit;
  // const skip = (parseInt(page) - 1) * limit;
  //? ==================2-filter====================
  // let filterObj = structuredClone(req.query);
  // filterObj = JSON.stringify(filterObj);
  // filterObj = filterObj.replace(/(lte|lt|gte|gt)/g, (value) => "$" + value);
  // filterObj = JSON.parse(filterObj);
  // const excludedFields = ["fields", "sort", "search"];
  // excludedFields.forEach((val) => {
  //   delete filterObj[val];
  // });
  // console.log(filterObj);
  // ! +++++++mu3ti code++++++++++++
  // let mongooseQuery = Product.find({
  //   ...filterObj,
  //   page: undefined,
  //   limit: undefined,
  // })
  //   .skip(skip)
  //   .limit(limit);
  //? ==================3-sort====================
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   // console.log(sortBy);
  //   mongooseQuery = mongooseQuery.sort(sortBy);
  // }
  //? ==================4-selected fields====================
  // if (req.query.fields) {
  //   const selectedFields = req.query.fields.split(",").join(" ");
  //   console.log(selectedFields);
  //   mongooseQuery = mongooseQuery.select(selectedFields);
  // }
  //? ==================5-search====================
  // if (req.query.search) {
  //   console.log(req.query.search);
  //   mongooseQuery = mongooseQuery.find({
  //     $or: [
  //       { title: { $regex: req.query.search, $options: "i" } },
  //       { description: { $regex: req.query.search, $options: "i" } },
  //     ],
  //   });
  // }

  // let products = await mongooseQuery;
  //* ------------|my code|------------
  // const sortBy = req.query?.sort?.split(",").join(" ");
  // const selectedFields = req.query?.fields?.split(",").join(" ");
  // console.log(sortBy);
  // console.log(selectedFields);
  // let mongooseQuery = Product.find({
  //   ...filterObj,
  //   page: undefined,
  //   limit: undefined,
  // })
  //   .skip(skip)
  //   .limit(limit)
  //   .sort(sortBy)
  //   .select(selectedFields);
  // if (req.query.search) {
  //   // console.log(req.query.search);
  //   mongooseQuery = mongooseQuery.find({
  //     $or: [
  //       { title: { $regex: req.query.search, $options: "i" } },
  //       { description: { $regex: req.query.search, $options: "i" } },
  //     ],
  //   });
  // }
  // let products = await mongooseQuery;

  // ---------------------------------
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .pagination()
    .select()
    .search()
    .sort()
    .filter();
  let products = await apiFeatures.mongooseQuery;
  // show matched results if found
  products.length &&
    res.status(200).json({
      msg: "success",
      page: apiFeatures.page,
      limit: apiFeatures.limit,
      products,
    });
  // if no products found
  products.length || next(new AppError(`no products found`, 404));
});
// ~=====================================|get product|===================================================
const getProduct = errorHandler(async (req, res, next) => {
  const product = await Product.findOne(req.params);
  product && res.json({ msg: "success", product });
  product || next(new AppError("product not found", 404));
});
// ~=====================================|update product|===================================================
const updateProduct = errorHandler(async (req, res, next) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    {
      new: true,
    }
  );
  product && res.status(201).json({ msg: "success", product });
  product || next(new AppError("product not found", 404));
});
//~=====================================|delete product|===================================================
const deleteProduct = errorHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (product) {
    // const applications = await product.find({
    //   productID: product._id,
    // });
    // for (const application of applications) {
    //   await Application.deleteMany({ _id: application._id });
    // }
    res.status(200).json({ msg: "product deleted", product });
  }
  product ?? next(new AppError(`product not found`, 404));
});

export { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
