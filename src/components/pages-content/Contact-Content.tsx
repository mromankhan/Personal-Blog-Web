"use client";
import Navbar from '@/components/Navbar';
import { db } from '@/firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactContent = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default theme

  useEffect(() => {
    // Function to detect theme
    const detectTheme = () => {
      const dataTheme = document.documentElement.getAttribute('data-theme');
      const classTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

      // Prefer `data-theme`, fallback to class-based
      const currentTheme = dataTheme || classTheme;
      setTheme(currentTheme === 'dark' ? 'dark' : 'light');
    };

    // Initial detection
    detectTheme();

    // Listen for changes to `data-theme` or class attribute
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect(); // Cleanup observer
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    const notify = () => toast("Message Send SucessFully!", {
      theme: theme, // Dynamically set toast theme
    });
    e.preventDefault()
    const msgData = {
      name,
      email,
      message,
      createdAt: new Date()
    };

    try {
      const msgRef = collection(db, "messages");
      await addDoc(msgRef, msgData);
      setName("");
      setEmail("");
      setMessage("")
      notify();

    } catch (e) {
      console.log("message Sending error:", e);
      // alert("Failed to Send Message. Please Try Again.");
      toast.error("Message Send Failed Please try again Later...", {
        theme: theme, // Dynamically set toast theme
      });
    }

  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 relative -top-10">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Contact Us
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              We&apos;d love to hear from you!
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input id="name" name="name" type="text" required
                  value={name} onChange={(e) => { setName(e.target.value) }}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm"
                  placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => { setEmail(e.target.value) }}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm"
                  placeholder="Email address" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea id="message" name="message" rows={4} required
                  value={message} onChange={(e) => { setMessage(e.target.value) }}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:z-10 sm:text-sm"
                  placeholder="Your Message"></textarea>
              </div>
            </div>

            <div>
              <button type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900">
                Send Message
              </button>
              <ToastContainer position='top-center' theme={theme} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactContent