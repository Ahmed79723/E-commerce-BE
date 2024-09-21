import mongoose, { Schema, model } from "mongoose";
// import slugify from "slugify";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "brand name already exists"],
      required: true,
      trim: true,
      minLength: [2, "brand name can't be less than 2 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    logo: String,
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
// brandSchema.pre("init", (doc) => {
//   doc.slug = slugify(doc.name);
// });
brandSchema.post("init", (doc) => {
  doc.logo = process.env.BASE_URL + "uploads/brands/" + doc.logo;
});
export const Brand = model("Brand", brandSchema);
