"use client";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import AuthFoam from '@/components/AuthFoam';

const Signup = () => {

  const router = useRouter();

  // const saveUserInFirestore = async (email: string, uid: string) => {
  //   const user = { email, uid };
  //   const docRef = doc(db, "users", uid);
  //   await setDoc(docRef, user);
  //   router.push("/");
  // }
  
  // async function saveUserInFirestore (email: string, uid: string){
  //   const user = { email, uid };
  //   const docRef = doc(db, "users", uid);
  //   await setDoc(docRef, user);
  //   router.push("/");
  // }

  async function saveUserInFirestore(email: string, uid: string) {
    try {
      const user = { email, uid };
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, user);
      // console.log("User successfully saved in Firestore");
  
      // Redirect user to home page
      router.push("/");
    } catch (error) {
      // console.error("Error saving user to Firestore:", error);
    }
  }
  


  const signup = async (email: string, password: string, userName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;
      await updateProfile(userData, { displayName: userName })
      await saveUserInFirestore(email, userData.uid);
      // console.log(userData, "user created sucessfull");

    } catch (e) {
      // console.log(e);
    }
  }


  return (
    <>
      <AuthFoam signup={true} func={signup} />
    </>
  );
}

export default Signup;