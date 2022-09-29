import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore } from "firebase/firestore";
const {
  REACT_APP_APIKEY, REACT_APP_AUTHDOMAIN, REACT_APP_PROJECTID, REACT_APP_STORAGEBUCKET,
  REACT_APP_MESSAGINGSENDERID, REACT_APP_APPID, REACT_APP_MEASUREMENTID
} = process.env; 

const firebaseConfig = {
  apiKey: REACT_APP_APIKEY ,
  authDomain: REACT_APP_AUTHDOMAIN,
  projectId: REACT_APP_PROJECTID,
  storageBucket: REACT_APP_STORAGEBUCKET,
  messagingSenderId: REACT_APP_MESSAGINGSENDERID,
  appId: REACT_APP_APPID,
  measurementId: REACT_APP_MEASUREMENTID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Conección a firestore
export const db = getFirestore(app)
