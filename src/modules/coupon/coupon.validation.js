import Joi from "joi";

const addCouponVal = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  logo: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }).required(),
});
const updateCouponVal = Joi.object({
  name: Joi.string().min(2).max(100),
  logo: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }),
  brandId: Joi.string().hex().length(24),
  slug: Joi.string().lowercase().min(3).max(150),
});
export { addCouponVal, updateCouponVal };
