import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// ["find", "findOne"]
reviewSchema.pre(/^find/, function () {
  this.populate("user", "username");
});
export const Review = model("Review", reviewSchema);
