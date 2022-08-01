////////////////////////////////////////
const Post = require("../models/postsModel");
const User = require("../models/userModel");
const Following = require("../models/followingModel");
const Comment = require("../models/commentModel");

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

  if (posts.length == 0) {
    res.status(404).render("error", {
      title: "Not found",
      data: "posts",
    });
  }

  res.status(200).render("myPosts", {
    title: "My posts",
    posts,
  });
};

exports.manageAllPosts = async (req, res, next) => {
  // let posts;
  let query = Post.find();

  query = query.sort("-createdAt");
  // posts = posts.sort("-createdAt");

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
    res.status(404).render("error", {
      title: "Not found",
      data: "followers",
    });
  }

  res.status(200).render("getFollower", {
    title: "My followers",
    followers,
  });
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
    res.status(404).render("error", {
      title: "Not found",
      data: "followings",
    });
  }

  res.status(200).render("getFollowing", {
    title: "My followings",
    followings,
  });
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  const userClicked = await User.findById(id);

  if (!userClicked) {
    res.status(200).render("error", {
      title: "Not found",
      data: "user",
    });
  }

  res.status(200).render("profileVisit", {
    title: `${userClicked.username}`,
    userClicked,
  });
};

exports.getAllComments = async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { post: req.params.id };

  const comments = await Comment.find(filter)
    .sort("-createdAt")
    .select("-__v -post");

  if (comments.length === 0) {
    res.status(200).render("error", {
      title: "No Comments",
      data: "comments",
    });
  }

  res.status(200).render("comments", {
    title: "Comments",
    comments,
  });
};

exports.getErrorPage = async (req, res, next) => {
  res.status(200).render("error", {
    title: "Not found",
  });
};
