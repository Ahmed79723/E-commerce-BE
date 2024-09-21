import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "subCategory name already exists"],
      required: true,
      trim: true,
      minLength: [3, "subCategory name can't be less than 3 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    image: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
subCategorySchema.pre("init", (doc) => {
  doc.slug = slugify(doc.name);
});
subCategorySchema.post("init", (doc) => {
  doc.image = "http://localhost:3011/uploads/subCategories/" + doc.image;
});
export const SubCategory = model("SubCategory", subCategorySchema);
