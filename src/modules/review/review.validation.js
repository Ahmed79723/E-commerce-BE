import Joi from "joi";

const addReviewVal = Joi.object({
  comment: Joi.string().min(2).max(500),
  user: Joi.string().hex().length(24),
  productId: Joi.string().hex().length(24),
  rate: Joi.number().min(0).max(5).required(),
});
const updateReviewVal = Joi.object({
  comment: Joi.string().min(2).max(500),
  user: Joi.string().hex().length(24),
  productId: Joi.string().hex().length(24),
  rate: Joi.number().min(0).max(5),
  id: Joi.string().hex().length(24),
});
export { addReviewVal, updateReviewVal };
