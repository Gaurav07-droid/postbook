const express = require("express");

const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//post/25631/comment
router.use(authController.protect);

router
  .route("/")
  .post(commentController.settingDefaultIds, commentController.createComment)
  .get(commentController.getAllComments);

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
