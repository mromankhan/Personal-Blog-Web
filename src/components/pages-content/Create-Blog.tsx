"use client";
import Navbar from '@/components/Navbar'
import { db } from '@/firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RichTextInput from '@/components/RichTextInput';

const CreateBlogContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const likes = 0;
  const dislikes = 0;

  useEffect(() => {
    const detectTheme = () => {
      const dataTheme = document.documentElement.getAttribute('data-theme');
      const classTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(dataTheme || classTheme === 'dark' ? 'dark' : 'light');
    };

    detectTheme();
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_blog_uploads"); // Apna Cloudinary Upload Preset Replace Karo
    formData.append("cloud_name", "dtqfdhyhb"); // Apna Cloudinary Cloud Name Replace Karo


    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dtqfdhyhb/image/upload?resource_type=raw", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary Response Error:", data);
        throw new Error(data.error?.message || "Failed to upload image");
      }

      if (!data.secure_url) {
        throw new Error("Cloudinary did not return an image URL");
      }

      return data.secure_url; // Image ka Cloudinary URL return karega
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new Error("Image upload failed");
    }
  };

  // Upload Image & Return URL
  const uploadPic = async (): Promise<string> => {
    if (!pic) {
      toast.error("Image is required!", { theme });
      throw new Error("No image selected");
    }

    return await uploadToCloudinary(pic);
  };

  // Add New Blog to Firestore
  const addNewBlog = async () => {
    try {
      const imageUrl = await uploadPic();

      const newBlog = {
        title,
        description,
        pic: imageUrl,
        currentDate,
        likes,
        dislikes
      };

      await addDoc(collection(db, "blogs"), newBlog);

      setTitle("");
      setDescription("");
      setPic(null);
      toast.success("Blog Added Successfully!", { theme });
    } catch (error) {
      console.error("Error while adding blog:", error);
      toast.error("Failed to add blog. Please try again.", { theme });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position='top-center' theme={theme} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Create New Post</h1>
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <RichTextInput value={description} onChange={setDescription} />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPic(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
              dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* Current Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Date
            </label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={addNewBlog}
            className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-500
            text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateBlogContent;
