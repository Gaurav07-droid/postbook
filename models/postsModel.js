const mongoose = require("mongoose");
const slugify = require("slugify");

const opts = { toJSON: { virtuals: true } };

const postSchema = new mongoose.Schema(
  {
    image: {
      type: [String],
      required: [true, "A post require an image!"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    likes: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      maxLength: [90, "Description must contain less than 30 words"],
    },

    slug: String,

    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    visible: { type: Boolean, default: true },
  },
  opts
);

//indexing
postSchema.index({ createdAt: 1 });

//Virtual populate
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "-followers profileImage username" });
  next();
});

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
