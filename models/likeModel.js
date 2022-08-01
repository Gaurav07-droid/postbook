const mongoose = require("mongoose");
const Post = require("../models/postsModel");

const likeSchema = new mongoose.Schema({
  like: {
    type: Boolean,
    default: false,
  },

  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: [true, "An like must be on post!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "An like must be by an user!"],
  },
});

likeSchema.index({ post: 1, user: 1 }, { unique: true });

likeSchema.pre(/^find/, function (next) {
  this.populate({ path: "post", select: "description image user" }).populate({
    path: "user",
    select: "profileImage username",
  });
  next();
});

likeSchema.statics.calcTotalLikes = async function (postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId },
    },

    {
      $group: { _id: "$post", nLikes: { $sum: 1 } },
    },
  ]);

  // console.log(stats);

  if (stats.length > 0) {
    await Post.findByIdAndUpdate(postId, {
      likes: stats[0].nLikes,
    });
  } else {
    await Post.findByIdAndUpdate(postId, {
      likes: 0,
    });
  }
};

likeSchema.post("save", function () {
  this.constructor.calcTotalLikes(this.post);
});

likeSchema.pre(/^findOneAnd/, async function (next) {
  this.l = await this.findOne().clone();
  // console.log(this.l);
  next();
});

likeSchema.post(/^findOneAnd/, async function () {
  if (this.l.like == false) {
    await this.l.constructor.calcTotalLikes(this.l.post);
  } else {
    await this.l.constructor.calcTotalLikes(this.l.post._id);
  }

  // await r;
});

const likeModel = mongoose.model("Like", likeSchema);

module.exports = likeModel;
