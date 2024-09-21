import { AppError } from "../utils/appError.js";
import { imagesCleanerMW } from "./imagesCleanerMW.js";

// this function is used to validate any user input against the provided joi schemas
// thru the entire app
const globalValidator = (schema) => {
  return (req, res, next) => {
    let userInput;
    if (req.file) {
      req.file.fieldname === "image"
        ? (userInput = { image: req.file })
        : req.file.fieldname === "logo"
        ? (userInput = { logo: req.file })
        : {};
    } else if (req.files) {
      req.files.images && req.files.coverImage
        ? (userInput = { ...req.files })
        : req.files.coverImage
        ? (userInput = { coverImage: req.files.coverImage })
        : req.files.logo
        ? (userInput = { logo: req.files.images })
        : {};
    }
    const { error } = schema.validate(
      {
        ...req.body,
        ...req.params,
        ...req.query,
        ...userInput,
      },
      { abortEarly: false }
    );
    if (error) {
      const errMsgs = error.details.map((err) => err.message);
      imagesCleanerMW();
      next(new AppError(errMsgs, 401));
    }
    next();
  };
};
export default globalValidator;
