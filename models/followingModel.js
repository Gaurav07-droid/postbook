const mongoose = require("mongoose");

const User = require("./userModel");

const followingSchema = new mongoose.Schema({
  follow: {
    type: Boolean,
    default: false,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User can follow other accounts only!"],
  },

  following: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User can follow other accounts only!"],
  },
});

followingSchema.index({ following: 1, user: 1 }, { unique: true });

followingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "description image username profileImage about",
  }).populate({
    path: "following",
    select: "profileImage username about",
  });
  next();
});

followingSchema.statics.calcTotalfollowers = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: { following: userId },
    },

    {
      $group: {
        _id: "$user",
        nFollowers: { $sum: 1 },
      },
    },
  ]);

  const user = await User.findById(userId);
  console.log(stats[0], stats[1]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      followers: stats.length,
    });
  } else if (stats.length == 0) {
    await User.findByIdAndUpdate(userId, {
      followers: 0,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      followers: user.followers - 1,
    });
  }
};

followingSchema.post("save", function () {
  this.constructor.calcTotalfollowers(this.following);
});

followingSchema.pre(/^findOneAnd/, async function (next) {
  this.f = await this.findOne().clone();

  next();
});

followingSchema.post(/^findOneAnd/, async function () {
  // console.log(this.f);
  if (this.f.follow == false) {
    await this.f.constructor.calcTotalfollowers(this.f.following);
  } else {
    await this.f.constructor.calcTotalfollowers(this.f.following._id);
  }
});

//////////////////////////////////////////////////////////////////
////////////////////Calculating Total Following///////////////////
//////////////////////////////////////////////////////////////////

followingSchema.statics.calcTotalFollowing = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: { user: userId },
    },
    {
      $group: { _id: "$user", nFollowing: { $sum: 1 } },
    },
  ]);

  // console.log(stats, stats.length);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      followings: stats[0].nFollowing,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      followings: 0,
    });
  }
};

followingSchema.post("save", function () {
  this.constructor.calcTotalFollowing(this.user);
});

followingSchema.pre(/^findOneAnd/, async function (next) {
  this.u = await this.findOne().clone();
  // console.log(this.u);

  next();
});

followingSchema.post(/^findOneAnd/, async function () {
  // console.log(this.u);
  // if (this.u.follow == true) {
  //   console.log(this.u)
  await this.u.constructor.calcTotalFollowing(this.u.user);
});

const followingModel = mongoose.model("Follow", followingSchema);

module.exports = followingModel;
