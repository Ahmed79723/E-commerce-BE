import Joi from "joi";
const sigUpValSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  recoveryEmail: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  role: Joi.string().min(3).max(20),
  mobileNumber: Joi.string()
    .pattern(/^(002|\+2)?01[0125][0-9]{8}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
});
const sigInValSchema = Joi.object({
  email: Joi.string().email(),
  mobileNumber: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
});
const updateValSchema = Joi.object({
  firstName: Joi.string().min(3).max(20),
  lastName: Joi.string().min(3).max(20),
  username: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  recoveryEmail: Joi.string().email(),
  role: Joi.string().min(3).max(20),
  mobileNumber: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
  id: Joi.string().hex().length(24).required(),
});
const changePassValSchema = Joi.object({
  oldPassword: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{8,40}$/),
  newPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("newPassword")).required(),
  email: Joi.string().email(),
  mobileNumber: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
  id: Joi.string().hex().length(24),
});
const forgetPassValSchema = Joi.object({
  newPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("newPassword")).required(),
  email: Joi.string().email(),
  mobileNumber: Joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
  id: Joi.string().hex().length(24).required(),
});
const userRecoveryEmailValSchema = Joi.object({
  recoveryEmail: Joi.string().email().required(),
});
export {
  sigUpValSchema,
  sigInValSchema,
  updateValSchema,
  changePassValSchema,
  forgetPassValSchema,
  userRecoveryEmailValSchema,
};
