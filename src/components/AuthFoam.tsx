"use client";
import React, { useState } from 'react'
import Link from 'next/link';

type PropsTypes = {
    signup? : boolean,
    func: (email: string, password: string, userName: string) => void;
}

const handleSubmit = (e: React.FormEvent)=>{
  e.preventDefault()
}

const AuthFoam = ({signup, func}: PropsTypes) => {
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
return (
  <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 p-5">
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
        <Link href="/resetPassword" className='text-[#2563eb] hover:text-[#2a68ee] dark:text-[#3b82f6] dark:hover:text-[#60a5fa]'><p className='mt-2'>{!signup ? "Forget Password" : "" }</p></Link>
      </div>
      <button type='submit' className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300" onClick={()=>{func(email, password, name)}} >
        {signup ? "Signin" : "Login"}
        </button>
    <div className="flex justify-center items-center mt-5">
    <p className="text-gray-700 dark:text-gray-300">{signup ? "Already have an Account?" : "Don't have any Account"} <Link href={signup ? "/login" : "/signup"} className='text-[#2563eb] hover:text-[#2a68ee] dark:text-[#3b82f6] dark:hover:text-[#60a5fa]'>{signup ? "Login" : "Signin"}</Link></p>
    </div>
    </form>
  </div>
);
};

export default AuthFoam;