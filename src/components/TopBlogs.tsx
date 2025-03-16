/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { buttonVariants } from './ui/button';
import Image from 'next/image';
import { Loader } from 'lucide-react';

const TopBlogsSection = () => {
  const [topBlogs, setTopBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("likes", "desc"), limit(3));  // Order by 'likes' field, limit to top 3
        const querySnapshot = await getDocs(q);
        const fetchedBlogs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopBlogs(fetchedBlogs);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      }
    };

    fetchTopBlogs();
  }, []);

  const truncateDescription = (description: string, maxLength = 40) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';  // Add 3 dots if longer
    }
    return description;
  };

  if (topBlogs.length === 0) {
    return <div className="flex items-center justify-center h-screen"><Loader className="size-12 animate-spin" /></div>;
  }

  return (
    <section className="py-12 bg-white dark:bg-[#0a0a0a]">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Top Blog Posts</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">Read the blogs with the most likes</p>
        </div>
        <div className="flex flex-wrap justify-center">
          {topBlogs.map(blog => (
            <div key={blog.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-[#111111] transform transition duration-500 hover:scale-105 text-center">
                <Image
                  src={blog.pic}
                  alt={blog.title}
                  width={500} // Adjust width as needed
                  height={256} // Adjust height as needed
                  className="w-full h-64 object-cover rounded-t-xl transition-opacity duration-300 hover:opacity-90"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">{blog.title}</h3>
                <p className="text-gray-600 dark:text-gray-400"><ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-3xl font-bold my-4" {...props} />,
                    h2: (props) => <h2 className="text-2xl font-semibold my-3" {...props} />,
                    h3: (props) => <h3 className="text-xl font-medium my-2" {...props} />,
                    p: (props) => <p className="text-gray-700 leading-6 my-2" {...props} />,
                  }}
                >{truncateDescription(blog.description)}</ReactMarkdown></p>
                <p className="my-2 text-gray-500 dark:text-gray-300">{blog.likes} Likes</p>
                <Link href={`/blogPost/${blog.id}`} className={`${buttonVariants({ variant: "outline" })} transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700`}>Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBlogsSection;
