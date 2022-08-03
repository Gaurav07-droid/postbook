const express = require("express");

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const app = express();
const router = express.Router();

router.get("/api/v1/forgot-password", viewsController.getForgotPassword);
router.get("/api/v1/reset-password", viewsController.getResetPassword);

router.use(authController.isLoggedIn);

router.get("/", viewsController.getLogin);
router.get("/api/v1/login", viewsController.getLogin);
router.get("/api/v1/signup", viewsController.getSignup);
router.get("/api/v1/home", viewsController.getPost);

router.get("/api/v1/me", viewsController.getMe);
router.get("/api/v1/my-posts", viewsController.getMyPosts);
router.get("/api/v1/change-password", viewsController.getChangePassword);
router.get("/api/v1/update-profile", viewsController.updateProfile);

router.get("/api/v1/user/:id", viewsController.getUser);
router.get("/api/v1/post/:id/comments", viewsController.getAllComments);

router.get("/api/v1/manage-posts", viewsController.manageAllPosts);
router.get("/api/v1/manage-users", viewsController.manageAllUsers);
router.get("/api/v1/delete-account", viewsController.getDeleteUserAcc);
router.get("/api/v1/my-followers", viewsController.getMyFollowers);
router.get("/api/v1/my-followings", viewsController.getMyFollowings);

module.exports = router;
