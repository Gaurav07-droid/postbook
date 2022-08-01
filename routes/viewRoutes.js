const express = require("express");

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getLogin);
router.get("/login", viewsController.getLogin);
router.get("/signup", viewsController.getSignup);
router.get("/home", viewsController.getPost);

router.get("/me", viewsController.getMe);
router.get("/my-posts", viewsController.getMyPosts);
router.get("/change-password", viewsController.getChangePassword);
router.get("/update-profile", viewsController.updateProfile);

router.get("/user/:id", viewsController.getUser);
router.get("/post/:id/comments", viewsController.getAllComments);

router.get("/manage-posts", viewsController.manageAllPosts);
router.get("/manage-users", viewsController.manageAllUsers);
router.get("/delete-account", viewsController.getDeleteUserAcc);
router.get("/my-followers", viewsController.getMyFollowers);
router.get("/my-followings", viewsController.getMyFollowings);

module.exports = router;
