/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { db } from '@/firebase/firebaseConfig';
import remarkGfm from "remark-gfm";
import ReactMarkdown from 'react-markdown';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Loader } from 'lucide-react';

const BlogDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const blogRef = doc(db, "blogs", id);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          setBlog({ id: blogSnap.id, ...blogSnap.data() });
        }
      } catch (e) {
        void e;
        // console.error(`Error fetching blog details: ${e}`); for dev
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (!blog) {
    return <div className="flex items-center justify-center h-screen"><Loader className="size-10 animate-spin" /></div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-center mb-6 dark:bg-gray-900 rounded-lg">
          <Image 
            src={blog.pic} 
            alt={blog.title} 
            width={700} 
            height={200} 
            className="w-full md:w-[70%] h-96 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105" 
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: (props) => <h1 className="text-3xl font-bold my-4" {...props} />,
              h2: (props) => <h2 className="text-2xl font-semibold my-3" {...props} />,
              h3: (props) => <h3 className="text-xl font-medium my-2" {...props} />,
              p: (props) => <p className="text-gray-700 leading-6 my-2" {...props} />,
            }}
          >{blog.description}</ReactMarkdown>
        </p>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          By Roman | {new Date(blog.currentDate).toLocaleDateString()}
        </div>
        <div className="text-gray-800 dark:text-gray-200">
          {blog.content}
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
