const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
  },

  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: [true, "An comment must be on post!"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "An comment must be by an user!"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: "post", select: "description image -user  " }).populate(
    {
      path: "user",
      select: "profileImage username",
    }
  );
  next();
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
