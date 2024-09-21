import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      unique: [true, "Product name already exists"],
      required: true,
      trim: true,
      minLength: [3, "Product name can't be less than 3 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [30, "Product description can't be less than 30 characters"],
      maxLength: [
        2000,
        "Product description can't be more than 2000 characters",
      ],
    },
    coverImage: String,
    images: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    sold: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    avgRate: {
      type: Number,
      min: 0,
      max: 5,
    },
    rateCount: {
      type: Number,
      min: 0,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    id: false,
  }
);
// productSchema.pre("init", (doc) => {
//   doc.slug = slugify(doc.title);
// });
productSchema.post("init", (doc) => {
  if (doc.coverImage)
    doc.coverImage =
      process.env.BASE_URL + "uploads/products/" + doc.coverImage;
  if (doc.images)
    doc.images = doc.images.map(
      (img) => process.env.BASE_URL + "uploads/products/" + img
    );
});

productSchema.virtual("myReviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
  // justOne: true,
});

productSchema.pre("findOne", function () {
  this.populate("myReviews");
});
export const Product = model("Product", productSchema);
