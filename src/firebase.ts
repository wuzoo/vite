// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAy62VVcmSE30pHFgJlkA5VkSJ6UILsr9s",
  authDomain: "twitter-reloaded-98ed4.firebaseapp.com",
  projectId: "twitter-reloaded-98ed4",
  storageBucket: "twitter-reloaded-98ed4.appspot.com",
  messagingSenderId: "653734583472",
  appId: "1:653734583472:web:062a9030dc040bf0c72f75",
  measurementId: "G-2MGNQVDYSJ",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;
