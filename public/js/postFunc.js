import axios from "axios";
import { showAlert } from "./alert.js";

export const createPost = async (data) => {
  try {
    const res = await axios({
      url: "/api/v1/posts",
      method: "POST",
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Post uploaded successfully!");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert("error", "Post must require an image and description!");
  }
};

export const likePost = async (postId) => {
  try {
    const res = await axios({
      url: `/api/v1/posts/${postId}/likes`,
      method: "POST",
    });

    location.reload(true);
  } catch (err) {
    showAlert("error", "You can only like a post once!");
  }
};

export const unlikePost = async (postId) => {
  try {
    const res = await axios({
      url: `/api/v1/likes/${postId}`,
      method: "DELETE",
    });
    location.reload(true);
  } catch (err) {
    showAlert("error", "You can only unlike a post once!");
  }
};

export const deletePost = async (postId) => {
  try {
    const res = await axios({
      url: `/api/v1/posts/${postId}`,
      method: "PATCH",
    });

    if (res.status === 204) {
      showAlert("success", "Post deleted successfully!");

      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert("error", "Something went wrong try again later!");
  }
};

export const deletePostAdmin = async (postId) => {
  try {
    const res = await axios({
      url: `/api/v1/posts/${postId}`,
      method: "DELETE",
    });

    if (res.status === 204) {
      showAlert("success", "Post deleted successfully!");

      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert("error", "Something went wrong try again later!");
  }
};

export const createComment = async (comment, postId) => {
  try {
    const res = await axios({
      url: `/api/v1/posts/${postId}/comments`,
      method: "POST",
      data: {
        comment,
      },
    });

    // console.log(res);
    if (res.data.status === "success") {
      showAlert("success", "Commented successfully!");

      // window.setTimeout(() => {
      //   // location.reload(true);
      // }, 1000);
    }
  } catch (err) {
    showAlert("error", "Something went wrong try again later!");
  }
};
