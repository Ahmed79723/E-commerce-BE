import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "category name already exists"],
      required: true,
      trim: true,
      minLength: [3, "category name can't be less than 3 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: [true, "slug name already exists"],
    },
    image: {
      type: String,
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

categorySchema.pre("init", (doc) => {
  if (doc.slug) doc.slug = slugify(doc.name);
});
categorySchema.post("init", (doc) => {
  if (doc.image)
    doc.image = "http://localhost:3011/uploads/categories/" + doc.image;
});
export const Category = model("Category", categorySchema);
