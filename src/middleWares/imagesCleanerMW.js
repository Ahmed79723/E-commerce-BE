import { errorHandler } from "./errorHandler.js";
import { fileURLToPath } from "url";
import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { AppError } from "../utils/appError.js";
import { Brand } from "../../models/brand.model.js";
import { SubCategory } from "../../models/subCategory.model.js";

// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = dirname(__filename);
// console.log("__dirname", __dirname);

export const imagesCleanerMW = errorHandler(async (req, res, next) => {
  // //! =======================|deleting added photos if there is a validation error|==========================
  // //* -----------|deleting coverImage image|----------------
  // if (req.files) {
  //   console.log("mw-new", req.files);
  //   if (req.files.coverImage) {
  //     const coverImage = req.files.coverImage[0].filename.split("/");
  //     const coverImageName = coverImage[coverImage.length - 1];
  //     const filePath = path.join(
  //       __dirname,
  //       `../../uploads/products/${coverImageName}`
  //     );

  //     async function deleteFile() {
  //       try {
  //         await fs.promises.unlink(filePath);
  //         console.log("File deleted successfully");
  //       } catch (err) {
  //         return next(new AppError(err, 500));
  //       }
  //     }

  //     deleteFile();
  //   }
  //   //* -----------|deleting array of images|----------------
  //   else if (req.files.images) {
  //     req.files.images.map((img) => {
  //       const image = img.filename.split("/");
  //       const imageName = image[image.length - 1];
  //       const filePath = path.join(
  //         __dirname,
  //         `../../uploads/products/${imageName}`
  //       );
  //       async function deleteFiles() {
  //         try {
  //           await fs.promises.unlink(filePath);
  //           console.log("File deleted successfully");
  //         } catch (err) {
  //           return next(new AppError(err, 500));
  //           // console.error("Error deleting file:", err);
  //         }
  //       }

  //       deleteFiles();
  //     });
  //   }
  // } else if (req.file) {
  //   const type = req.file.logo ?? req.file.image;
  //   const photo = type.filename.split("/");
  //   const photoName = photo[photo.length - 1];
  //   const filePath = path.join(
  //     __dirname,
  //     `../../../uploads/brands/${photoName}`
  //   );

  //   async function deleteFile() {
  //     try {
  //       await fs.promises.unlink(filePath);
  //       console.log("File deleted successfully");
  //     } catch (err) {
  //       return next(new AppError(err, 500));
  //       // console.error("Error deleting file:", err);
  //     }
  //   }

  //   deleteFile();
  // }
  // =========================
  const dBaseCleaner = () => {
    // Function to schedule daily check at 11:59 PM
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(23, 59, 0, 0); // 11:59 PM today
    let timeUntilCheck = targetTime.getTime() - now.getTime();

    // If the target time has already passed today, schedule for tomorrow
    if (timeUntilCheck < 0) {
      targetTime.setDate(targetTime.getDate() + 1);
      timeUntilCheck = targetTime.getTime() - now.getTime();
    }
    // ==================
    async function checkImgs() {
      //?^---------------------------------------|global cleaner function|---------------------------------------
      async function cleanCode(schema, FolderPath, flag) {
        try {
          console.log(flag);
          // Fetch all products
          const dbSchema = await schema.find({});

          // Get all image filenames from the database
          const dbImageFiles = new Array();
          dbSchema.forEach((doc) => {
            if (doc.logo || doc.image || doc.coverImage) {
              const docImg =
                doc.logo?.split("/") ||
                doc.image?.split("/") ||
                doc.coverImage?.split("/");
              const docImgName = docImg[docImg.length - 1];
              dbImageFiles.push(docImgName);
            }
            if (doc.images) {
              doc.images.forEach((image) => {
                const coverImg = image.split("/");
                const coverImgName = coverImg[coverImg.length - 1];
                dbImageFiles.push(coverImgName);
              });
            }
          });
          // Get all image filenames from the server folder
          const serverImageFiles = new Array(
            ...(await fs.promises.readdir(FolderPath))
          );

          // Identify and remove images that are not in the database
          for (const file of serverImageFiles) {
            if (!dbImageFiles.includes(file)) {
              await fs.promises.unlink(path.join(FolderPath, file));
              console.log(`Removed unused image: ${file}`);
            }
          }

          console.log("Image synchronization completed.");
        } catch (error) {
          console.error("Error during image synchronization:", error);
        }
      }
      //? ---------------------------------------|Product|---------------------------------------
      // Path to your product images folder
      const productsImgsFolderPath = path.join(
        "C:/Users/Ahmed/Desktop/Route/ROUTE BACKEND/E-Commerce",
        "/uploads/products"
      );
      cleanCode(Product, productsImgsFolderPath, "product");
      // console.log("imagesFolderPath", imagesFolderPath);
      // try {
      //   // Fetch all products
      //   const products = await Product.find({});

      //   // Get all image filenames from the database
      //   const dbImageFiles = new Array();
      //   products.forEach((product) => {
      //     if (product.coverImage) {
      //       const coverImg = product.coverImage.split("/");
      //       const coverImgName = coverImg[coverImg.length - 1];
      //       dbImageFiles.push(coverImgName);
      //     }
      //     product.images.forEach((image) => {
      //       const coverImg = image.split("/");
      //       const coverImgName = coverImg[coverImg.length - 1];
      //       dbImageFiles.push(coverImgName);
      //     });
      //   });
      //   console.log("dbImageFiles", dbImageFiles);
      //   // Get all image filenames from the server folder
      //   const serverImageFiles = new Array(
      //     ...(await fs.promises.readdir(imagesFolderPath))
      //   );
      //   console.log("serverImageFiles", serverImageFiles);

      //   // Identify and remove images that are not in the database
      //   for (const file of serverImageFiles) {
      //     if (!dbImageFiles.includes(file)) {
      //       await fs.promises.unlink(path.join(imagesFolderPath, file));
      //       console.log(`Removed unused image: ${file}`);
      //     }
      //   }
      // } catch (error) {
      //   console.error("Error during image synchronization:", error);
      // }
      //? ---------------------------------------|Category|---------------------------------------
      // Path to your product images folder
      const catImgsFolderPath = path.join(
        "C:/Users/Ahmed/Desktop/Route/ROUTE BACKEND/E-Commerce",
        "/uploads/categories"
      );
      // cleanCode(Category, catImgsFolderPath, "cat");
      // try {
      //   // Fetch all products
      //   const categories = await Category.find({});

      //   // Get all image filenames from the database
      //   const dbImageFiles = new Array();
      //   categories.forEach((category) => {
      //     if (category.image) {
      //       const Img = category.image.split("/");
      //       const ImgName = Img[Img.length - 1];
      //       dbImageFiles.push(ImgName);
      //     }
      //   });
      //   console.log("c-dbImageFiles", dbImageFiles);
      //   // Get all image filenames from the server folder
      //   const serverImageFiles = new Array(
      //     ...(await fs.promises.readdir(catImgsFolderPath))
      //   );
      //   console.log("c-serverImageFiles", serverImageFiles);

      //   // Identify and remove images that are not in the database
      //   for (const file of serverImageFiles) {
      //     if (!dbImageFiles.includes(file)) {
      //       await fs.promises.unlink(path.join(catImgsFolderPath, file));
      //       console.log(`c-Removed unused image: ${file}`);
      //     }
      //   }

      //   console.log("c-Image synchronization completed.");
      // } catch (error) {
      //   console.error("c-Error during image synchronization:", error);
      // }
      //? ---------------------------------------|Brand|---------------------------------------
      // Path to your product images folder
      const brandImgsFolderPath = path.join(
        "C:/Users/Ahmed/Desktop/Route/ROUTE BACKEND/E-Commerce",
        "/uploads/brands"
      );
      // cleanCode(Brand, brandImgsFolderPath, "brand");
      // try {
      //   // Fetch all products
      //   const brands = await Brand.find({});

      //   // Get all image filenames from the database
      //   const dbImageFiles = new Array();
      //   brands.forEach((brand) => {
      //     if (brand.logo) {
      //       const logo = brand.logo.split("/");
      //       const logoName = logo[logo.length - 1];
      //       dbImageFiles.push(logoName);
      //     }
      //   });
      //   console.log("b-dbImageFiles", dbImageFiles);
      //   // Get all image filenames from the server folder
      //   const serverImageFiles = new Array(
      //     ...(await fs.promises.readdir(brandImgsFolderPath))
      //   );
      //   console.log("b-serverImageFiles", serverImageFiles);

      //   // Identify and remove images that are not in the database
      //   for (const file of serverImageFiles) {
      //     if (!dbImageFiles.includes(file)) {
      //       await fs.promises.unlink(path.join(brandImgsFolderPath, file));
      //       console.log(`b-Removed unused image: ${file}`);
      //     }
      //   }

      //   console.log("b-Image synchronization completed.");
      // } catch (error) {
      //   console.error("b-Error during image synchronization:", error);
      // }
      //? ---------------------------------------|subCategory|---------------------------------------
      // Path to your product images folder
      const subCategoryImgsFolderPath = path.join(
        "C:/Users/Ahmed/Desktop/Route/ROUTE BACKEND/E-Commerce",
        "/uploads/subCategories"
      );
      // cleanCode(SubCategory, subCategoryImgsFolderPath, "subCategories");
      // let productsArr = [];
      // const allProductImages = Product.find();
      // for (const item of allProductImages) {
      //   if (item.images) {
      //     productsArr.push(...item.images);
      //   } else if (item.coverImage) {
      //     productsArr.push(item.coverImage);
      //   }
      // }
      // fs.writeFile(`${__dirname}../../../../uploads/products`, content, (err) => {
      //   if (err) {
      //     // Handle any errors that occur during the file write process
      //     console.error("Error updating DB", err);
      //     return next(new AppError("Error updating DB", 401));
      //   } else {
      //     // Confirm that the file was written successfully
      //     console.log("DB updated successfully!");
      //   }
      // });
      //? -----------------------------------|Category|---------------------------------------
      // let categoriesArr = [];
      // const allCategoriesImages = Category.find();
      // for (const item of allCategoriesImages) {
      //   if (item.image) {
      //     categoriesArr.push(...item.image);
      //   }
      // }
      // fs.writeFile(
      //   `${__dirname}../../../../uploads/categories`,
      //   content,
      //   (err) => {
      //     if (err) {
      //       // Handle any errors that occur during the file write process
      //       console.error("Error updating DB", err);
      //       return next(new AppError("Error updating DB", 401));
      //     } else {
      //       // Confirm that the file was written successfully
      //       console.log("DB updated successfully!");
      //     }
      //   }
      // );
      //? -----------------------------------|Category|---------------------------------------
    }
    // ==================

    // Schedule the first check
    setTimeout(() => {
      // Run the check at 11:59 PM
      checkImgs();
      console.log("checked");

      // Schedule the daily interval after the first check
      setInterval(checkImgs, 24 * 60 * 60 * 1000); // Every 24 hours
    }, timeUntilCheck);
  };
  dBaseCleaner();
});
