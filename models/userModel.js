const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const opts = { toJSON: { virtuals: true } };

const userSchema = new mongoose.Schema(
  {
    profileImage: { type: String, default: "default.jpg" },

    name: {
      type: String,
      minLength: [2, "A username must have more than 2 characters"],
      maxLength: [15, "A username doesnot have less than 15 characters"],
      required: [true, "A user must have a name"],
    },

    username: {
      unique: true,
      type: String,
      required: [true, "A user must have a username"],
      minLength: [2, "A username must have more than 2 characters"],
      maxLength: [15, "A username doesnot have less than 15 characters"],
    },

    about: {
      type: String,
      // maxLength: [30, "User about doesnot have more than 30 characters"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    email: {
      type: String,
      required: [true, "An user must have an email"],
      validate: [validator.isEmail, "Please provide an valid email"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please provide an password"],
      minLength: [8, "An password must have 8 characters"],
      select: false,
    },

    followers: {
      type: Number,
      default: 0,
    },

    followings: {
      type: Number,
      default: 0,
    },

    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Password doesnot match! Try again",
      },
      required: [true, "Please confirm your password"],
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,

    active: {
      type: Boolean,
      default: true,
    },
  },
  opts
);

userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre(/^find/, async function (next) {
  this.populate({ path: "followers", select: "profileImage username" });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatepasswrod,
  userPassword
) {
  return await bcrypt.compare(candidatepasswrod, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.generateRandomToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 60 * 1000;

  return resetToken;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
