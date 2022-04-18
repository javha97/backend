import firebase from "firebase";
const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyBPfbdyhPEDAnhrEMa6MkAoh0854oXGTVI",
  authDomain: "grocery-store-2959c.firebaseapp.com",
  projectId: "grocery-store-2959c",
  storageBucket: "grocery-store-2959c.appspot.com",
  messagingSenderId: "801805053942",
  appId: "1:801805053942:web:5e2a66af4e142c7a93e1d7",
});
 export const db = firebaseConfig.firestore();
 
