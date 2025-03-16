"use client";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import AuthFoam from '@/components/AuthFoam';
import { toast, ToastContainer } from 'react-toastify';

const Signup = () => {

  const router = useRouter();

  async function saveUserInFirestore(email: string, uid: string) {
    try {
      const user = { email, uid };
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, user);
      // console.log("User successfully saved in Firestore"); for dev

      // Redirect user to home page
      router.push("/");
    } catch (e) {
      void e;
      // console.error("Error saving user to Firestore:", e); for dev
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
      void e;
      toast.error("Something went Wrong")
      // console.log(e); for dev
    }
  }


  return (
    <>
      <ToastContainer position='top-center' />
      <AuthFoam signup={true} func={signup} />
    </>
  );
}

export default Signup;