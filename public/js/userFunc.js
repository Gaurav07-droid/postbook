import axios from "axios";
import { showAlert } from "./alert.js";

export const updateMe = async (data) => {
  try {
    const res = await axios({
      url: "/api/v1/users/updateMe",
      method: "PATCH",
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Data updated successfully!");
      window.setTimeout(() => {
        location.assign("/api/v1/me");
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", err);
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await axios({
      url: `/api/v1/users/${userId}`,
      method: "DELETE",
    });

    if (res.status === 204) {
      showAlert("success", "User deleted successfully!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", "Somehting went wrong! Try again later");
  }
};

export const deleteMe = async () => {
  try {
    const res = await axios({
      url: `/api/v1/users/deleteMe`,
      method: "PATCH",
    });

    if (res.status === 204) {
      showAlert("success", "User deleted successfully!");

      window.setTimeout(() => {
        location.assign("/api/v1/login");
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", err.message);
  }
};

export const removeProfile = async () => {
  try {
    const res = await axios({
      url: `/api/v1/users/removeProfile`,
      method: "PATCH",
    });

    if (res.status === 200) {
      showAlert("success", "Profile image removed successfully!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    } else {
      showAlert(
        "error",
        "Could'nt remove profile photo now!Please try after some time."
      );
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", "Oops something went very wrong. Try gain later");
  }
};

export const followUser = async (userId, userName) => {
  try {
    const res = await axios({
      url: `/api/v1/users/${userId}/follow`,
      method: "POST",
    });

    if (res.data.status === "success") {
      showAlert("success", `you started following ${userName}`);

      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    } else {
      showAlert("error", "You can only follow a user once!");
    }
  } catch (err) {
    showAlert("error", "Something went wrong!Couldn't get user.");
  }
};

export const unfollowUser = async (userId, userName) => {
  try {
    const res = await axios({
      url: `/api/v1/users/${userId}/follow`,
      method: "GET",
    });

    const followingId = res.data.data[0]._id;

    const res2 = await axios({
      url: `/api/v1/follow/${followingId}`,
      method: "DELETE",
    });

    if (res2.status === 204) {
      showAlert("success", `You unfollowed ${userName}.`);

      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    } else {
      showAlert("error", "You can only unfollow a user once");
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", `Opps! something went wrong .Try again later.`);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      url: "/api/v1/users/forgotPassword",
      method: "POST",
      data: {
        email,
      },
    });

    // console.log(res);

    if (res.data.status === "success") {
      showAlert("success", res.data.message);

      window.setTimeout(() => {
        location.assign("/api/v1/reset-password");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      url: `/api/v1/users/resetPassword/${token}`,
      method: "PATCH",
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Password reseted sucessfully");

      window.setTimeout(() => {
        location.assign("/api/v1/home");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
