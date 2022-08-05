////////////////////////////////////////
const Post = require("../models/postsModel");
const User = require("../models/userModel");
const Following = require("../models/followingModel");
const Comment = require("../models/commentModel");
const AppError = require("../utils/appError");

exports.getLogin = (req, res, next) => {
  res.status(200).render("login", {
    title: "Login to your account",
  });
};

exports.getSignup = (req, res, next) => {
  res.status(200).render("signup", {
    title: "create new account",
  });
};

exports.getPost = async (req, res, next) => {
  const allPosts = await Post.find({ visible: true }).sort("-createdAt");

  res.status(200).render("Allpost", {
    title: "Home",
    allPosts,
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render("account", {
    title: "My profile",
  });
};

exports.getChangePassword = (req, res, next) => {
  res.status(200).render("changePassword", {
    title: "Change password",
  });
};

exports.getMyPosts = async (req, res, next) => {
  const posts = await Post.find({ user: req.user.id, visible: true });

  if (posts.length === 0) {
    return next(
      new AppError(
        "You didn't posted anything yet!Please post and try again",
        404
      )
    );
  } else {
    res.status(200).render("myPosts", {
      title: "My posts",
      posts,
    });
  }
};

exports.manageAllPosts = async (req, res, next) => {
  // let posts;
  let query = Post.find();

  query = query.sort("-createdAt");

  const posts = await query;

  res.status(200).render("myPosts", {
    title: "manage posts",
    posts,
  });
};

exports.manageAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).render("userCard", {
    title: "manage users",
    users,
  });
};

exports.updateProfile = (req, res, next) => {
  res.status(200).render("updateProfile", {
    title: "Update profile",
  });
};

exports.getDeleteUserAcc = (req, res, next) => {
  res.status(200).render("deleteAccount", {
    title: "Delete my account",
  });
};

exports.getMyFollowers = async (req, res, next) => {
  let filter = {};
  if (req.params.userId) {
    filter = { following: req.params.userId, follow: true };
  } else if (!req.params.id) {
    filter = { following: req.user.id, follow: true };
  }

  const followers = await Following.find(filter);

  if (followers.length <= 0) {
    return next(
      new AppError(" No one is following you! Please try again later", 404)
    );
  } else {
    return res.status(200).render("getFollower", {
      title: "My followers",
      followers,
    });
  }
};

exports.getMyFollowings = async (req, res, next) => {
  let filter = {};
  if (req.params.userId) {
    filter = { user: req.params.userId, follow: true };
  } else if (!req.params.id) {
    filter = { user: req.user.id, follow: true };
  }

  const followings = await Following.find(filter);

  // const followings = await doc.following;

  if (followings.length == 0) {
    return next(
      new AppError(
        "You are not following anyone! Please follow and try again later",
        404
      )
    );
  } else {
    return res.status(200).render("getFollowing", {
      title: "My followings",
      followings,
    });
  }
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  const userClicked = await User.findById(id);

  if (!userClicked) {
    return next(new AppError("No user found!Please try again later", 404));
  } else {
    return res.status(200).render("profileVisit", {
      title: `${userClicked.username}`,
      userClicked,
    });
  }
};

exports.getAllComments = async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { post: req.params.id };

  const comments = await Comment.find(filter)
    .sort("-createdAt")
    .select("-__v -post");

  if (comments.length === 0) {
    return next(
      new AppError("No comments found yet! Please try again later", 404)
    );
  } else {
    return res.status(200).render("comments", {
      title: "Comments",
      comments,
    });
  }
};

exports.getForgotPassword = (req, res, next) => {
  res.status(200).render("forgotpass", {
    title: "Forgot password",
  });
};

exports.getResetPassword = (req, res, next) => {
  res.status(200).render("resetpass", {
    title: "Forgot password",
  });
};

// exports.getError = (req, res, next) => {
//   res.status(200).render("error", {
//     title: "Not found",
//     data: "page",
//   });
// };
