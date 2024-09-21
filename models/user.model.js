import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    recoveryEmail: String,
    isBlocked: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    otp: String,
    otpExpire: Date,
    changePass: Date,
    wishList: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        street: String,
        city: String,
        state: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 8);
});
userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 8);
});
export const User = model("User", userSchema);
