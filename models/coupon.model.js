import mongoose, { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    expireOn: Date,
    discountPercentage: Number,
    appliedOn: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Coupon = model("Coupon", couponSchema);
