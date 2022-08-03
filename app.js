const express = require("express");
const morgan = require("morgan");
// const { dirname } = require("path");

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
// const hpp = require("hpp");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const likeRouter = require("./routes/likeRoutes");
const userRouter = require("./routes/userRoutes");
const followingRouter = require("./routes/followingRoutes");
const viewRouter = require("./routes/viewRoutes");

const globalErrorHandler = require("./controllers/globalErrorHandler");

const AppError = require("./utils/appError");

const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");

//limiter options
const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, Please try again in an hour!",
});

//Global middlewares
app.use(morgan("dev"));

//Body parser,reading data from the req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

//serving satatic files
app.use(express.static(`${__dirname}/public`));

//RateLimiting (No of request per minute)
app.use("/api", limiter);

//Setting various HTTP headers.
// app.use(helmet());

// app.use(hpp);

//Data sanitize againts noSql queries
app.use(mongoSanitize());

//Data sanitize against XSS
app.use(xss());

//compression
app.use(compression());

app.use("/", viewRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/follow", followingRouter);

app.all("*", (req, res, next) => {
  res.render("error", {
    title: "not found",
  });
  next(new AppError(`Couldn't found ${req.originalUrl} on  his server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
