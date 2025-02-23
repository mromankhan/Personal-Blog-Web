/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';

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
    return <div>Loading...</div>;
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Top Blog Posts</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">Read the blogs with the most likes</p>
        </div>
        <div className="flex flex-wrap justify-center">
          {topBlogs.map(blog => (
            <div key={blog.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 transform transition duration-500 hover:scale-105 text-center">
                <img
                  src={blog.pic}
                  alt={blog.title}
                  className="w-full h-64 object-fill transition-opacity duration-300 hover:opacity-90"
                />
                <p className="text-gray-600 dark:text-gray-400">{truncateDescription(blog.description)}</p>
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">{blog.title}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300">{blog.likes} Likes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBlogsSection;
