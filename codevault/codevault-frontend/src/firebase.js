import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-VrJOXXFEsHwOKcy0MDBfPsRzfuW-6YI",
  authDomain: "codevault-b6001.firebaseapp.com",
  projectId: "codevault-b6001",
  storageBucket: "codevault-b6001.firebasestorage.app",
  messagingSenderId: "157143854645",
  appId: "1:157143854645:web:e6198a66c88814d42d0b7c",
  measurementId: "G-ZDCR8LDVM0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult };
