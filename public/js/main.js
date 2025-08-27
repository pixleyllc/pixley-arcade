// js/main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// Firebase config - move this to firebase-init.js if you want!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MSG_SENDER_ID",
  appId: "YOUR_APP_ID",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const navLogin = document.getElementById("nav-login");
const navUser = document.getElementById("nav-user");
const userName = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");
const footerSignup = document.getElementById("footer-signup");

function showUser(user) {
  navLogin.style.display = "none";
  navUser.style.display = "inline";
  userName.textContent = user.displayName || user.email;
}

function showGuest() {
  navLogin.style.display = "inline";
  navUser.style.display = "none";
}

onAuthStateChanged(auth, (user) => {
  if (user) showUser(user);
  else showGuest();
});

navLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch(err => alert("Login failed: " + err.message));
});

logoutBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth).catch(err => alert("Logout failed: " + err.message));
});

footerSignup?.addEventListener("click", () => {
  navLogin.click();
});

