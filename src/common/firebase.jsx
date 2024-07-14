import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBHzdWCrHPj0FFlgPvLThUUCo_d_7UrqBg",
  authDomain: "epicentra-blog.firebaseapp.com",
  projectId: "epicentra-blog",
  storageBucket: "epicentra-blog.appspot.com",
  messagingSenderId: "387013411434",
  appId: "1:387013411434:web:a7237797e638847452c013"
};



const app = initializeApp(firebaseConfig);

// google auth

const provider=new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle=async()=>{
    let user=null;

    await signInWithPopup(auth,provider)
    .then((result)=>{
        user=result.user
    })
    .catch(err=>{
        console.log(err);
    })

    return user
}