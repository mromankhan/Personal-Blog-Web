"use client";
import React, { useState } from 'react'
import Link from 'next/link';
import { auth, db } from '@/firebase/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

type PropsTypes = {
  signup?: boolean,
  func: (email: string, password: string, userName: string) => void,
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
}

const AuthFoam = ({ signup, func }: PropsTypes) => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // User data
      const user = result.user;

      // Save user in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
      }, { merge: true });
      // console.log("User signed in with Google:", user); for dev
      router.push("/");

    } catch (e) {
      void e;
      // console.error("Google Sign-In Error:", error); for dev
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-[#0a0a0a] p-5">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">{signup ? "Sign Up" : "Login"}</h2>
        <div className={signup ? "visible mb-4" : "hidden"}>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name:</label>
          <input
            type="text"
            id="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"

          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            required
          />
          <Link href="/resetPassword" className='text-[#2563eb] hover:text-[#2a68ee] dark:text-[#3b82f6] dark:hover:text-[#60a5fa]'><p className='mt-2'>{!signup ? "Forget Password" : ""}</p></Link>
        </div>
        <button type='submit' className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300" onClick={() => { func(email, password, name) }} >
          {signup ? "Signin" : "Login"}
        </button>
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button type='submit' className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300" onClick={googleSignIn} >
          <FcGoogle size={24} /> Continue with Google
        </button>
        <div className="flex justify-center items-center mt-5">
          <p className="text-gray-700 dark:text-gray-300">{signup ? "Already have an Account?" : "Don't have any Account"} <Link href={signup ? "/login" : "/signup"} className='text-[#2563eb] hover:text-[#2a68ee] dark:text-[#3b82f6] dark:hover:text-[#60a5fa]'>{signup ? "Login" : "Signin"}</Link></p>
        </div>
      </form>
    </div>
  );
};

export default AuthFoam;