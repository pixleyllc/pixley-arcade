// /public/js/main.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDR4bwMoeVZ39EstyiG-HNmHNdLuztn_cU",
  authDomain: "pixley-arcade.firebaseapp.com",
  projectId: "pixley-arcade",
  storageBucket: "pixley-arcade.firebasestorage.app",
  messagingSenderId: "115314116623",
  appId: "1:115314116623:web:556c994edb0a292f793b7a",
  measurementId: "G-Y7ZFC541XE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const navLogin = document.getElementById("nav-login");
const navUser = document.getElementById("nav-user");
const userName = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");
const footerSignup = document.getElementById("footer-signup");

function showUser(user) {
  navLogin && (navLogin.style.display = "none");
  navUser && (navUser.style.display = "inline");
  userName && (userName.textContent = user.displayName || user.email);
}

function showGuest() {
  navLogin && (navLogin.style.display = "inline");
  navUser && (navUser.style.display = "none");
}

onAuthStateChanged(auth, (user) => {
  if (user) showUser(user);
  else showGuest();
});

navLogin && navLogin.addEventListener("
