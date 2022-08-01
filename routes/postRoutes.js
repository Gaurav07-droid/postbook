const express = require("express");

const postController = require("../controllers/postController");
const commentRouter = require("../routes/commentRoutes");
const likeRouter = require("../routes/likeRoutes");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.use("/:postId/comments", commentRouter);
router.use("/:postId/likes", likeRouter);

router
  .route("/")
  .get(authController.checkingIfFollow, postController.getAllPosts)
  .post(
    postController.uploadpostImage,
    postController.resizePostImages,
    postController.settingUserId,
    postController.createPost
  );

router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.deletePost)
  .delete(postController.deletePostAdmin);

module.exports = router;
