import { Cart } from "../../../models/cart.model.js";
import { errorHandler } from "../../middleWares/errorHandler.js";
import { AppError } from "../../utils/appError.js";

// ~=====================================|delete One|===================================================
const deleteOne = (model) => {
  return errorHandler(async (req, res, next) => {
    const document = await model.findByIdAndDelete(req.params.id);
    document ?? next(new AppError(`document not found`, 404));
    document && res.status(200).json({ msg: "document deleted", document });
  });
};
// ~=====================================|create Cash Order|===================================================
const clearCart = (model) => {
  return errorHandler(async (req, res, next) => {
    const cart = await model.findOneAndDelete({ userId: req.sysUser.userId });
    cart && res.status(201).json({ msg: "success", cart });
    cart || next(new AppError("cart not found", 404));
  });
};
export { deleteOne, clearCart };
