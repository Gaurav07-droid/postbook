const express = require("express");

const likeController = require("../controllers/likeController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//post/25631/comment
router.use(authController.protect);

router
  .route("/")
  .post(likeController.settingDefaultIds, likeController.giveLike)
  .get(likeController.getAllLikes);

router
  .route("/:id")
  .get(likeController.getLike)
  .patch(likeController.updateLike)
  .delete(likeController.deleteLike);

module.exports = router;
