"use client";
import Navbar from '@/components/Navbar'
import { db } from '@/firebase/firebaseConfig';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RichTextInput from '@/components/RichTextInput';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

const CreateBlogContent = () => {
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blogId");
  const { theme, detectTheme } = useThemeStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const [existingPic, setExistingPic] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  // const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(false);
  const likes = 0;
  const dislikes = 0;

      useEffect(() => {
        detectTheme();
      },[])

  useEffect(() => {
    if (blogId) {
      const fetchBlog = async () => {
        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blogData = docSnap.data();
          setTitle(blogData.title);
          setDescription(blogData.description);
          setExistingPic(blogData.pic);
          setCurrentDate(blogData.currentDate);
        }
      };
      fetchBlog();
    }
  }, [blogId]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_blog_uploads");
    formData.append("cloud_name", "dtqfdhyhb");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dtqfdhyhb/image/upload?resource_type=raw", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.secure_url) {
        throw new Error("Failed to upload image");
      }
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleBlogSubmission = async () => {
    setLoading(true);
    try {
      const imageUrl = pic ? await uploadToCloudinary(pic) : existingPic;

      const blogData = {
        title,
        description,
        pic: imageUrl,
        currentDate,
        likes,
        dislikes,
      };

      if (blogId) {
        const docRef = doc(db, "blogs", blogId);
        await updateDoc(docRef, blogData);
        toast.success("Blog Updated Successfully!", { theme });
      } else {
        await addDoc(collection(db, "blogs"), blogData);
        toast.success("Blog Added Successfully!", { theme });
      }

      setTitle("");
      setDescription("");
      setPic(null);
    } catch (error) {
      console.error("Error while handling blog:", error);
      toast.error("Failed to process blog. Please try again.", { theme });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position='top-center' theme={theme} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-[#0a0a0a] p-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
          {blogId ? "Edit Blog" : "Create New Post"}
        </h1>
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <RichTextInput value={description} onChange={setDescription} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Upload</label>
            <input type="file" accept="image/*" onChange={(e) => setPic(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            {existingPic && !pic && <img src={existingPic} alt="Existing Blog" className="mt-4 w-full h-40 object-cover rounded" />}
          </div>

          <button type="button" disabled={loading} onClick={handleBlogSubmission} className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            {loading ? <span className='flex justify-center items-center'><Loader2 className="size-6 animate-spin" /></span> : blogId ? "Update Blog" : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateBlogContent;
