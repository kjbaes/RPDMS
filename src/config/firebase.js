import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyALn6FGceWP4LQ_k8w4CZ6nUWvFlFdfZ4A",
  authDomain: "rpdm-aae38.firebaseapp.com",
  projectId: "rpdm-aae38",
  storageBucket: "rpdm-aae38.appspot.com",
  messagingSenderId: "34026211292",
  appId: "1:34026211292:web:c59cecdf40fb184352f119",
  measurementId: "G-045VTV7W8R",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export { app };
