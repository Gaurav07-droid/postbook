const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("Uncaught Exception!shutting down....💥");

  process.exit(1);
});

const app = require("./app.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then((con) => {
  console.log("Database connected succesfully!");
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection!Shutting down....💥");

  server.close(() => {
    process.exit(1);
  });
});
