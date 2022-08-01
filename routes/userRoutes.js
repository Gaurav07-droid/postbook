const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const followingRouter = require("../routes/followingRoutes");
const postRouter = require("../routes/postRoutes");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/signup").post(authController.signup);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.use(authController.protect);

///Nested routes
router.use("/:userId/follow", followingRouter);
router.use("/:userId/posts", postRouter);
router.use("/Myfollowers", followingRouter);
router.use("/Myfollowings", followingRouter);

router.get("/me", userController.getMe);

router.get("/logout", authController.logout);
router.patch("/deleteMe", userController.deleteMe);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.patch("/updatePassword", authController.updatePassword);
router.patch("/removeProfile", userController.removeprofileImage);

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.restrictTo("admin"), userController.updateUser)
  .delete(authController.restrictTo("admin"), userController.deleteUser);

module.exports = router;
