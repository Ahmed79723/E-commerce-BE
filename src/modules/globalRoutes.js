import addressRouter from "./address/address.routes.js";
import authRouter from "./Auth/authentication.routes.js";
import brandRouter from "./brands/brand.routes.js";
import cartRouter from "./cart/cart.routes.js";
import categoryRouter from "./categories/category.routes.js";
import couponRouter from "./coupon/coupon.routes.js";
import orderRouter from "./order/order.routes.js";
import productRouter from "./products/product.routes.js";
import reviewRouter from "./review/review.routes.js";
import subCategoryRouter from "./subCategory/subCategory.routes.js";
import userRouter from "./users(Admin)/users.routes.js";
import wishListRouter from "./wishList/wishList.routes.js";

export const globalRoutes = (app) => {
  app.use("/api/categories", categoryRouter);
  app.use("/api/subCategories", subCategoryRouter);
  app.use("/api/brands", brandRouter);
  app.use("/api/products", productRouter);
  app.use("/api/auth/users", authRouter);
  app.use("/api/admin/users", userRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/wishList", wishListRouter);
  app.use("/api/address", addressRouter);
  app.use("/api/coupons", couponRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", orderRouter);
};
