import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAskx0Qa8d8n2jG2p4vY34yRUaZBN5ZMNo",
  authDomain: "tinder-clone-368510.firebaseapp.com",
  projectId: "tinder-clone-368510",
  storageBucket: "tinder-clone-368510.appspot.com",
  messagingSenderId: "46940775425",
  appId: "1:46940775425:web:8e91108e5ea20e09b78c00"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore;
const auth = firebaseApp.auth();

export { auth, db };