import { Product } from "../../../models/product.model.js";
import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../errorHandler.js";

const wishListUpdateMW = errorHandler(async (req, res, next) => {
  //   const items = req.body.whishList;
  //   for (const item of items) {
  //     let product = await Product.findById(item);
  //     if (!product) {
  //       //   break;
  //       return next(new AppError("product not found", 404));
  //     }
  //   }
  const item = await Product.findById(req.body.product);
  if (!item) {
    return next(new AppError("item not found", 404));
  }
  next();
});
export { wishListUpdateMW };
