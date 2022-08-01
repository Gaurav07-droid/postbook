const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.settingDefaultIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create({
    comment: req.body.comment,
    user: req.body.user,
    post: req.body.post,
  });

  res.status(200).json({
    status: "success",
    data: comment,
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.postId) filter = { post: req.params.postId };

  const comments = await Comment.find(filter)
    .sort("-createdAt")
    .select("-__v -post");

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: comments,
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);

  if (!comment)
    return next(
      new AppError("No comment found with that id!Please try again", 404)
    );

  res.status(200).json({
    status: "success",
    data: comment,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedComment = await Comment.findByIdAndUpdate(id, req.body);

  if (!updatedComment)
    return next(
      new AppError("No comment found with that id!Please try again", 404)
    );
  res.status(200).json({
    status: "success",
    data: updatedComment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Comment.findByIdAndDelete(id, req.body);

  res.status(204).json({
    status: "success",
  });
});
