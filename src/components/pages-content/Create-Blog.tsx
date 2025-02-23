"use client";
import Navbar from '@/components/Navbar'
import { db, storage } from '@/firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBlogContent = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pic, setPic] = useState<File>();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default theme
  const likes = 0;
  const dislikes = 0;


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



  const uploadPic = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!pic) {
        toast.error("Image is required!", { theme });
        reject("No image selected");
        return;
      }

      const uniqueFileName = `images/${new Date().getTime()}-${pic.name}`;
      const storageRef = ref(storage, uniqueFileName);
      const uploadTask = uploadBytesResumable(storageRef, pic);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload ${progress}% complete`);
        },
        (error) => {
          console.error("Upload failed:", error);
          toast.error("Image upload failed. Please try again.", { theme });
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // console.log(`File available at ${downloadURL}`);
            resolve(downloadURL);
          } catch (error) {
            // console.error("Error fetching download URL:", error);
            reject(error);
          }
        }
      );
    });
  };

  const addNewBlog = async () => {
    try {
      // Wait for the image to upload and get its URL
      const imageUrl = await uploadPic();

      // Prepare the new blog object
      const newBlog = {
        title,
        description,
        pic: imageUrl,
        currentDate,
        likes,
        dislikes
      };

      // Save to Firestore
      const dbRef = collection(db, "blogs");
      await addDoc(dbRef, newBlog);

      // console.log(`New Blog Added: ${JSON.stringify(newBlog)}`);
      setTitle("");
      setDescription("");
      setPic(undefined); // Clear the selected image
      toast.success("Blog Added Successfully!", { theme });
    } catch (error) {
      console.error("Error while adding blog:", error);
      toast.error("Failed to add blog. Please try again.", { theme });
    }
  };


  // submit refreshing handler
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <>
      <Navbar />
      <ToastContainer position='top-center' theme={theme} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 ">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Create New Post</h1>
        <form onSubmit={submitHandler} className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input type="text" id="title" name="title"
              value={title} onChange={(e) => { setTitle(e.target.value) }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" required />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea id="description" name="description" rows={4}
              value={description} onChange={(e) => { setDescription(e.target.value) }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" required>
            </textarea></div>
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Upload</label>
            <input type="file" id="image" name="image" accept="image/*"
              onChange={(e) => { const file = e.target.files; if (file?.length) { setPic(file[0]); } }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-[#121212]" required />
          </div>

          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 
                        mb-2">Current Date</label>
            <input type="date" id="date" name="date"
              value={currentDate} onChange={(e) => { setCurrentDate(e.target.value) }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" required />
          </div>
          <button type="submit" onClick={addNewBlog}
            className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-500
                     text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateBlogContent













