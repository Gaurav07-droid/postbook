const AppError = require("../utils/appError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    `This field value:/${
      value.split('"')[1]
    }/ is already used. Please try another one!`,
    400
  );
};

const handleJWTError = () =>
  new AppError("Invalid token! Please login again.", 401);

const handleJWTExpireError = () =>
  new AppError("Your token has been expired! Please login again.", 401);

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(".")}`;

  return new AppError(message, 400);
};

const sendErrorDev = (req, err, res) => {
  // APIs
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    //rendered site
  } else {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      mssg: err.message,
    });
  }
};

const sendErrorProd = (req, err, res) => {
  //Apis
  //operational error ,known error
  if (req.originalUrl.startsWith("/s")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //unknown error
      console.log("ERROR💥", err);

      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
    //Rendered site
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        title: "Somehthing went wrong! ",
        mssg: err.message,
      });
    } else {
      //unknown error
      console.log("ERROR💥", err);

      res.status(err.statusCode).render("error", {
        title: "Somethig went wrong!",
        mssg: "Application is down! Please try again later",
      });
    }
  }
};

const globalErrrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(req, err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastError(err);
    if (err.code === 11000) err = handleDuplicateError(err);
    if (err.name === "ValidationError") err = handleValidationError(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpireError();

    return sendErrorProd(req, err, res);
  }
};

module.exports = globalErrrorHandler;
