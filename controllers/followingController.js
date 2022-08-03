const Following = require("../models/followingModel");
const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.settingDefaultIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.following) req.body.following = req.params.userId;
  // if (!req.body.following) req.body.following = req.user.id;

  next();
};

exports.followUser = catchAsync(async (req, res, next) => {
  const follow = await Following.create({
    follow: true,
    user: req.body.user,
    following: req.body.following,
  });

  // const user = await User.findById(req.params.id);

  // await findByIdAndUpdate(user._id, {
  //   followers: user.followers + 1,
  // });

  res.status(200).json({
    status: "success",
    data: follow,
  });
});

exports.getAllFollowers = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.userId) {
    filter = { following: req.params.userId, follow: true };
  } else if (!req.params.id) {
    filter = { following: req.user.id, follow: true };
  }

  const following = await Following.find(filter);

  res.status(200).json({
    status: "success",
    results: following.length,
    data: following,
  });
});

exports.getFollowing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const following = await Following.findById(id);

  if (!following)
    return next(
      new AppError("No follow found with that id!Please try again", 404)
    );

  res.status(200).json({
    status: "success",
    data: following,
  });
});

exports.updateFollowing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedFollowing = await Following.findByIdAndUpdate(id, {
    follow: req.body.follow,
  });

  if (!updatedFollowing)
    return next(
      new AppError("No follow found with that id!Please try again", 404)
    );
  res.status(200).json({
    status: "success",
    data: updatedFollowing,
  });
});

exports.deleteFollowing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  await Following.findByIdAndDelete(id);

  await User.findByIdAndUpdate(user._id, {
    followings: user.followings - 1,
  });

  await res.status(204).json({
    status: "success",
  });
});
