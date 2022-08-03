import axios from "axios";
import { showAlert } from "./alert.js";

export const login = async (username, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        username,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged In successfully!");

      window.setTimeout(() => {
        location.assign("/api/v1/home");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

exports.logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged out successfully!");
      window.setTimeout(() => {
        location.assign("/api/v1/login");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", "Something went wrong!Try again");
  }
};

export const passwordChange = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updatePassword",
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });

    // console.log(res);

    if (res.data.status === "success") {
      showAlert("success", "Password updated successfully!");

      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert(
      "error",
      err.response.data.message.includes("passwordConfirm:")
        ? err.response.data.message.split("passwordConfirm:")[1]
        : err.response.data.message
    );
    // console.log(err);
    window.setTimeout(() => {
      location.reload(true);
    }, 1500);
  }
};

export const signup = async (
  username,
  name,
  email,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      url: "http://127.0.0.1:3000/api/v1/users/signup",
      method: "POST",
      data: {
        username,
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    console.log(res);

    if (res.data.status === "success") {
      showAlert("success", "Account created successfully!");

      window.setTimeout(() => {
        location.assign("/api/v1/home");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
