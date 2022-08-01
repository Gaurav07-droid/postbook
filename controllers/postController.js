const Post = require("../models/postsModel");
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

exports.uploadpostImage = upload.array("image", 4);

exports.resizePostImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);

  if (!req.files) return next();

  req.body.image = [];

  await Promise.all(
    req.files.map(async (img, i) => {
      const filename = `post-${req.user.username}-img${
        i + 1
      }-${Date.now()}.jpeg`;

      await sharp(img.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/usersPost/${filename}`);

      req.body.image.push(filename);
    })
  );

  next();
});

exports.settingUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createPost = catchAsync(async (req, res, next) => {
  if (!req.body.description && !req.body.image) {
    return next(
      new AppError("A post must contain a image and description", 405)
    );
  }

  const post = await Post.create({
    image: req.body.image,
    description: req.body.description,
    user: req.body.user,
  });

  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.userId) filter = { user: req.params.userId, visible: true };

  let query = Post.find(filter);

  //sorting
  query = query.sort("-createdAt");
  //limiting fileds
  query = query.select("-__v");

  const posts = await query;

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: posts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate({
    path: "comments",
    select: "comment -post",
  });

  if (!post)
    return next(
      new AppError("No post found with that id!Please try again", 404)
    );

  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedPost = await Post.findByIdAndUpdate(id, req.body);

  if (!updatedPost)
    return next(
      new AppError("No post found with that id!Please try again", 404)
    );

  res.status(200).json({
    status: "success",
    data: updatedPost,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Post.findByIdAndUpdate(id, {
    visible: false,
  });

  res.status(204).json({
    status: "success",
  });
});

exports.deletePostAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Post.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
  });
});
