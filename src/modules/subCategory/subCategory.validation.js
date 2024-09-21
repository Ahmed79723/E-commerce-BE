import Joi from "joi";

const addSubCategoryVal = Joi.object({
  name: Joi.string().min(3).max(150),
  image: Joi.object({
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
  category: Joi.string().hex().length(24),
});
const updateSubCategoryVal = Joi.object({
  name: Joi.string().min(3).max(150),
  image: Joi.object({
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
  category: Joi.string().hex().length(24),
  id: Joi.string().hex().length(24),
});

export { addSubCategoryVal, updateSubCategoryVal };
