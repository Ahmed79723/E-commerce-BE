import mongoose from "mongoose";

export const dbConnection = mongoose
  .connect("mongodb+srv://Rana:rana014500@e-commerce.j07rt.mongodb.net/E-CommerceDB")
  .then(() => {
    console.log("database connected successfully!");
  });
// .catch((err) => {
//   console.log(err);
// });
