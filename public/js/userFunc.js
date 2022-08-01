import axios from "axios";
import { showAlert } from "./alert.js";

export const deleteUser = async (userId) => {
  try {
    const res = await axios({
      url: `http://127.0.0.1:3000/api/v1/users/${userId}`,
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
      url: `http://127.0.0.1:3000/api/v1/users/deleteMe`,
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
      url: `http://127.0.0.1:3000/api/v1/users/removeProfile`,
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
      url: `http://127.0.0.1:3000/api/v1/users/${userId}/follow`,
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
      url: `http://127.0.0.1:3000/api/v1/users/${userId}/follow`,
      method: "GET",
    });

    const followingId = res.data.data[0]._id;

    const res2 = await axios({
      url: `http://127.0.0.1:3000/api/v1/follow/${followingId}`,
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
    console.log(err);
    showAlert("error", `Opps! something went wrong .Try again later.`);
  }
};