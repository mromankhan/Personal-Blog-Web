/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

const BlogDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Get the blog ID from URL parameters
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const blogRef = doc(db, "blogs", id);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          setBlog({ id: blogSnap.id, ...blogSnap.data() });
        } else {
          // console.log("Blog not found");
        }
      } catch (e) {
        console.error(`Error fetching blog details: ${e}`);
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (!blog) {
    return <div className="text-center mt-10">Blog not found.</div>;
  }

  return (
    <>
      <Navbar />
      {/* <Image src={''} alt={''} /> */}
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <Image src={blog.pic} alt={blog.title} height={100} width={100} className="w-full lg:w-[60%] md:w-[50%] h-64 object-fill mb-6 rounded-lg " />
        <p className="text-gray-700 dark:text-gray-300 mb-6">{blog.description}</p>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          By Roman | {new Date(blog.currentDate).toLocaleDateString()}
        </div>
        <div className="text-gray-800 dark:text-gray-200">
          {blog.content} {/* Assuming you have a 'content' field for the full blog text */}
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;

