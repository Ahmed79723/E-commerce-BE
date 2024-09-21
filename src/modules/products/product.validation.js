import Joi from "joi";

const addProductVal = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  description: Joi.string().min(30).max(150).required(),
  coverImage: Joi.array()
    .items({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string()
        .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
        .required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      size: Joi.number().max(5242880).required(),
    })
    .required(),
  images: Joi.array().items({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().max(5242880).required(),
  }),
  price: Joi.number().min(0).required(),
  priceAfterDiscount: Joi.number().min(0).required(),
  sold: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  category: Joi.string().hex().length(24),
  subCategory: Joi.string().hex().length(24),
  brand: Joi.string().hex().length(24),
  avgRate: Joi.number().min(0).max(5),
  rateCount: Joi.number().min(0),
});
const updateProductVal = Joi.object({
  title: Joi.string().min(3).max(150),
  description: Joi.string().min(30).max(150),
  coverImage: Joi.array().items({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().max(5242880).required(),
  }),
  images: Joi.array().items({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().max(5242880).required(),
  }),
  price: Joi.number().min(0),
  priceAfterDiscount: Joi.number().min(0),
  sold: Joi.number().min(0),
  stock: Joi.number().min(0),
  category: Joi.string().hex().length(24),
  subCategory: Joi.string().hex().length(24),
  brand: Joi.string().hex().length(24),
  avgRate: Joi.number().min(0).max(5),
  rateCount: Joi.number().min(0),
  id: Joi.string().hex().length(24),
  slug: Joi.string().min(3).max(150),
});

export { addProductVal, updateProductVal };
