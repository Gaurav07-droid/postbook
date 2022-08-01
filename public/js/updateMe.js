import axios from "axios";
import { showAlert } from "./alert.js";

export const updateMe = async (data) => {
  try {
    const res = await axios({
      url: "http://127.0.0.1:3000/api/v1/users/updateMe",
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
    console.log(err);
    showAlert("error", err);
  }
};
