import { AppError } from "../utils/appError.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const fileUpload = (folderName) => {
  //& =====================================|disk Storage|===================================================
  const storage = multer.diskStorage({
    // responsible for file storing destination control
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`);
    },
    // responsible for file naming control before storing it on hard disk
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });
  //* =====================================|file Filter|===================================================
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("images only", 401), false);
    }
  }
  //?=====================================|file upload|===================================================
  const upload = multer({
    storage,
    fileFilter,
    // limits: { fileSize: 1 * 1024 * 1024 },
  });
  return upload;
};

// ------------------------------------------------------------------------------
const uploadSingleFile = (fieldName, folderName) =>
  fileUpload(folderName).single(fieldName);
// ------------------------------------------------------------------------------
const uploadManyFiles = (fieldName, maxCount, folderName) =>
  fileUpload(folderName).array(fieldName, maxCount);
// ------------------------------------------------------------------------------
const uploadMixOfFiles = (arrayOfFields, folderName) =>
  fileUpload(folderName).fields(arrayOfFields);

export { uploadSingleFile, uploadMixOfFiles, uploadManyFiles };
