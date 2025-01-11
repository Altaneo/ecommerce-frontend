import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBTFT0eZfSCF2L-34ghwSg7OEWQtPdp6rk",
  authDomain: "shop-b1011.firebaseapp.com",
  projectId: "shop-b1011",
  storageBucket: "shop-b1011.firebasestorage.app",
  messagingSenderId: "721738715628",
  appId: "1:721738715628:web:b8219c05d713211f5870c9",
  measurementId: "G-02RQWTSLLN"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
