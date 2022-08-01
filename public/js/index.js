import { login, logout, passwordChange } from "./auth";
import {
  createPost,
  likePost,
  unlikePost,
  deletePost,
  deletePostAdmin,
  createComment,
} from "./postFunc";
import {
  deleteUser,
  deleteMe,
  removeProfile,
  followUser,
  unfollowUser,
} from "./userFunc";
import { updateMe } from "./updateMe";

const loginForm = document.querySelector(".form_login");
const formCreatePost = document.querySelector(".form-create-post");
const formUpdateMe = document.querySelector(".form-user-data");
const formPasswordChange = document.querySelector(".user-view__form-container");

const btnLogout = document.getElementById("logout");
const btnLike = document.querySelectorAll(".like-btn");
const btnUnlike = document.querySelectorAll(".unlike-btn");
const btnDeletePost = document.querySelectorAll(".delete-post");
const btnDelPost = document.querySelectorAll("#delpost-Admin");
const btnRemoveProfile = document.getElementById("removeprofile");
const btnCmmnt = document.querySelectorAll("#cmmnt-btn");
const btnDeleteUser = document.querySelectorAll(".btn-delete-user");
const btnDeleteMe = document.getElementById("DeleteAccount");
const btnFollow = document.querySelector(".btn-follow");
const btnUnfollow = document.querySelector(".btn-unfollow");

const username = document.getElementById("username");
const password = document.getElementById("password");
const curPassword = document.getElementById("password-current");
const confPassword = document.getElementById("password-confirm");
const cmmntText = document.querySelectorAll(".cmmnt");
// const comment = document.ge(loginForm);

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    login(username.value, password.value);
  });

if (btnLogout)
  btnLogout.addEventListener("click", () => {
    logout();
  });

if (formCreatePost)
  formCreatePost.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append("image", document.getElementById("photo").files[0]);
    form.append("description", document.getElementById("createPost").value);
    createPost(form);
  });

if (formUpdateMe)
  formUpdateMe.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("username", document.getElementById("username").value);
    form.append("name", document.getElementById("name").value);
    form.append("profileImage", document.getElementById("photo").files[0]);
    form.append("email", document.getElementById("email").value);
    form.append("about", document.getElementById("about").value);

    updateMe(form);
  });

if (formPasswordChange)
  formPasswordChange.addEventListener("submit", (e) => {
    e.preventDefault();

    passwordChange(curPassword.value, password.value, confPassword.value);
  });

if (btnLike)
  btnLike.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const postId = e.target.dataset.postid;

      likePost(postId);
      e.target.textContent = "Liked";
    })
  );

if (btnUnlike)
  btnUnlike.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const postId = e.target.dataset.postid;

      unlikePost(postId);
      e.target.textContent = "Unliked";
    });
  });

if (btnDeletePost)
  btnDeletePost.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const postId = e.target.dataset.postid;

      deletePost(postId);
    });
  });

if (btnDelPost)
  btnDelPost.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const postId = e.target.dataset.postid;

      deletePostAdmin(postId);
    });
  });

if (btnDeleteUser)
  btnDeleteUser.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const userId = e.target.dataset.userid;

      deleteUser(userId);
    });
  });

if (btnDeleteMe)
  btnDeleteMe.addEventListener("click", (e) => {
    const confirm = prompt(
      "Please type 'Delete' to delete your account.",
      "Type here.."
    );
    if (confirm === "Delete") {
      deleteMe();
    } else {
      return location.reload(true);
    }
  });

if (btnRemoveProfile)
  btnRemoveProfile.addEventListener("click", () => {
    removeProfile();
  });

btnCmmnt.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const postId = e.target.dataset.postid;

    cmmntText.forEach((cmmnt) => {
      if (cmmnt.value) {
        const comment = cmmnt.value;
        createComment(comment, postId);
        e.target.textContent = "commented";
        cmmnt.value = "";
      }
    });
  });
});

if (btnFollow)
  btnFollow.addEventListener("click", (e) => {
    const userId = e.target.dataset.userid;
    const userName = e.target.dataset.username;

    followUser(userId, userName);
    // btnFollow.removeChild(".btn-follow");
  });

if (btnUnfollow)
  btnUnfollow.addEventListener("click", (e) => {
    const userId = e.target.dataset.userid;
    const userName = e.target.dataset.username;

    unfollowUser(userId, userName);
  });
