const express = require("express");

const followingController = require("../controllers/followingController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//user/25631/follow
router.use(authController.protect);

router
  .route("/")
  .post(followingController.settingDefaultIds, followingController.followUser)
  .get(authController.checkingIfFollow, followingController.getAllFollowers);

router
  .route("/:id")
  .get(followingController.getFollowing)
  .patch(followingController.updateFollowing)
  .delete(followingController.deleteFollowing);

module.exports = router;
