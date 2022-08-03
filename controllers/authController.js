const User = require("../models/userModel");
const Follow = require("../models/followingModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/sendEmail");
const crypto = require("crypto");

exports.checkingIfFollow = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    const curUser = req.user.id;
    const user = req.params.userId;

    const follower = await Follow.findOne({ following: user, user: curUser });

    if (!follower)
      return next(
        new AppError(
          `You can only see post of people you follow! follow ${user.username} to see there posts`,
          401
        )
      );
  }

  next();
});

exports.restrictTo = (...obj) => {
  return (req, res, next) => {
    if (obj.includes(req.user.role)) {
      return next();
    } else {
      return next(
        new AppError("You are not allowed to access this route!", 401)
      );
    }
  };
};

const signToken = (req, res, newUser, statusCode) => {
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // console.log(token);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwared-proto"] === "https",
  };

  // if (req.secure || req.headers["x-forwared-proto"] === "https")
  //   cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  //remove password from the output
  newUser.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: newUser },
  });
};

// exports.restrictTo = (...person) => {};
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("You are not logged in! Please login to get access.", 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError("User belonging to this token is no longer exists", 401)
    );

  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(
        "User recently changed the password! Please login again.",
        401
      )
    );

  req.user = freshUser;
  next();
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      if (!decoded) return next();

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      req.user = currentUser;
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    name: req.body.name,
    profileImage: req.body.profileImage,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    about: req.body.about,
  });

  const url = 0;

  await new Email(user, url).sendWelcome();

  signToken(req, res, user, 200);

  // const message = "welcome to our family.Hope you enjoy our application.";

  // await sendEmail({
  //   email: user.email,
  //   subject: "Welcome to the shareView family!",
  //   message,
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(" Incorrect email or password! Try again", 401));
  }

  if (!user.active)
    return next(
      new AppError(
        "User not found!Please check username or password and try again.",
        404
      )
    );

  signToken(req, res, user, 200);
});

exports.logout = (req, res, next) => {
  res.cookie("jwt", "loggeout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError("No user found with that email! Try again.", 404));

  //generate token
  const resetToken = user.generateRandomToken();
  await user.save({ validateBeforeSave: false });
  try {
    //send token to user email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetToken).sendPassToken();

    res.status(200).json({
      status: "success",
      message: "Token sent to the email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log(err);
    return next(
      new AppError("There was an error sending email!Try again later", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new AppError("Invalid token or your token has been expired", 400)
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;

  await user.save();

  signToken(req, res, user, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(
      new AppError("Your current password is wrong! Try again.", 401)
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // res.status(200).json({
  //   status: "success",
  //   message: "Password changed successfully!",
  // });

  signToken(req, res, user, 200);
});
