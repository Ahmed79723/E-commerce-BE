import mongoose from "mongoose";

export const dbConnection = mongoose
  .connect(
    `mongodb+srv://${process.env.cloud_DB_user}:${process.env.cloud_DB_pass}@e-commerce.j07rt.mongodb.net/E-CommerceDB`,
    {
      serverSelectionTimeoutMS: 5000, // Increase this value as needed
    }
  )
  .then(() => {
    console.log("database connected successfully!");
  });
// .catch((err) => {
//   console.log(err);
// });
