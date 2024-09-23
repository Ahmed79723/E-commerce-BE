import mongoose from "mongoose";

export const dbConnection = mongoose
  .connect(
    "mongodb+srv://Rana:rana014500@e-commerce.j07rt.mongodb.net/E-CommerceDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Increase this value as needed
    }
  )
  .then(() => {
    console.log("database connected successfully!");
  });
// .catch((err) => {
//   console.log(err);
// });
