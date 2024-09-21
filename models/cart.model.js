import mongoose, { Schema, model } from "mongoose";
// import slugify from "slugify";

const cartSchema = new Schema(
  {
    cartItems: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    totalCartPrice: Number,
    discount: Number,
    totalPriceAfterDiscount: Number,
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Cart = model("Cart", cartSchema);
