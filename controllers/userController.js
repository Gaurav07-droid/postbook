const User = require("../models/userModel");
const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image!Please upload an image here.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("profileImage");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  console.log();
  if (!req.file) return next();

  req.file.filename = `user-${req.user.username}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/userProfile/${req.file.filename}`);

  next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user)
    return next(
      new AppError("No user found with that id!Please try again", 404)
    );

  res.locals.user = user;
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(id, req.body);

  if (!updatedUser)
    return next(
      new AppError("No user found with that id!Please try again", 404)
    );

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    "-passwordResetToken -passwordResetTokenExpires"
  );

  if (!user.active)
    return next(
      new AppError("Please login to activate your account./login", 404)
    );

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for updating password! Use /updatePassword/ for that.",
        400
      )
    );

  await User.findByIdAndUpdate(req.user.id, {
    username: req.body.username,
    name: req.body.name,
    profileImage: req.file ? req.file.filename : "default.jpg",
    email: req.body.email,
    about: req.body.about,
  });

  res.status(200).json({
    status: "success",
    message: "changes updated succesfully",
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.cookie("jwt", "loggeout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(204).json({
    status: "success",
  });
});

exports.removeprofileImage = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findByIdAndUpdate(id, {
    profileImage: "default.jpg",
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});
