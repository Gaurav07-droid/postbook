const Like = require("../models/likeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.settingDefaultIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.giveLike = catchAsync(async (req, res, next) => {
  const like = await Like.create({
    like: true,
    user: req.body.user,
    post: req.body.post,
  });

  res.status(200).json({
    status: "success",
    data: like,
  });
});

exports.getAllLikes = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.postId) filter = { post: req.params.postId, like: true };

  const likes = await Like.find(filter);

  res.status(200).json({
    status: "success",
    results: likes.length,
    data: likes,
  });
});

exports.getLike = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const like = await Like.findById(id);

  if (!like)
    return next(
      new AppError("No Like found with that id!Please try again", 404)
    );

  res.status(200).json({
    status: "success",
    data: like,
  });
});

exports.updateLike = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedLike = await Like.findByIdAndUpdate(id, { like: req.body.like });

  if (!updatedLike)
    return next(
      new AppError("No like found with that id!Please try again", 404)
    );

  res.status(200).json({
    status: "success",
    data: updatedLike,
  });
});

exports.deleteLike = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Like.findOne({ post: id });
  // console.log(post);

  await Like.findByIdAndDelete(post._id);

  res.status(204).json({
    status: "success",
  });
});
