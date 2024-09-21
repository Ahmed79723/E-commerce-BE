import Joi from "joi";

const addAddressVal = Joi.object({
  address: Joi.object({
    street: Joi.string().min(3).max(30).required(),
    city: Joi.string().min(3).max(30).required(),
    state: Joi.string().min(3).max(30).required(),
  }).required(),
});
const deleteAddressVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export { addAddressVal, deleteAddressVal };
