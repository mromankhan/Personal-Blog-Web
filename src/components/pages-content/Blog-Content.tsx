"use client";
import CommentsSec from '@/components/CommentsSec';
import Navbar from '@/components/Navbar';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/firebase/firebaseConfig';
import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { UseAuthStore } from '@/store/useAuthStore';
import { deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BlogContent = () => {

  const { user } = UseAuthStore((state) => state);

  const [blogs, setBlogs] = useState<any>([]);
  const [likedBlogs, setLikedBlogs] = useState<{ [key: string]: boolean }>({});
  const [dislikedBlogs, setDislikedBlogs] = useState<{ [key: string | ""]: boolean }>({});
  const [expendedBlogId, setexpendedBlogId] = useState<string | null>(null);
  // const [showOptions, setShowOptions] = useState<{[key: string]: boolean}>({}); // Options ke liye state
  const [hoveredBlogId, setHoveredBlogId] = useState<string | null>(null);
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


  const fetchBlogs = async () => {
    try {
      const blogRef = collection(db, "blogs");
      const snapshot = await getDocs(blogRef);
      const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogList);
    } catch (error) {
      // console.log(`Data fetching error ${error}`);
    }
  }


  useEffect(() => {
    fetchBlogs();
  }, [])

  const handleDelete = async (blogId: string) => {
    if (blogId) {
      try {
        const blogRef = doc(db, "blogs", blogId)
        await deleteDoc(blogRef);
        await fetchBlogs();
        toast.success("Blog Deleted!");

      } catch (e) {
        // console.log(`blog delete function error is ${e}`);
      }
    } else {
      // console.log("blog id is not available");

    }
  }

  const handleLike = async (blogId: string) => {
    const currentLikeStatus = likedBlogs[blogId] || false;
    const blogRef = doc(db, "blogs", blogId);

    // Optimistically update UI first
    setBlogs((prevBlogs: any[]) =>
      prevBlogs.map((blog: any) =>
        blog.id === blogId
          ? { ...blog, likes: blog.likes + (currentLikeStatus ? -1 : 1) }
          : blog
      )
    );

    setLikedBlogs(prevState => ({
      ...prevState,
      [blogId]: !currentLikeStatus,
    }));

    // Update Firebase
    try {
      await updateDoc(blogRef, {
        likes: increment(currentLikeStatus ? -1 : 1),
      });

      // Reset dislike if liked
      if (dislikedBlogs[blogId]) {
        await updateDoc(blogRef, {
          dislikes: increment(-1),
        });
        setDislikedBlogs(prevState => ({
          ...prevState,
          [blogId]: false,
        }));
      }
    } catch (error) {
      // console.log(`Error updating like: ${error}`);
      // Rollback state on error
      setBlogs((prevBlogs: any[]) =>
        prevBlogs.map((blog: any) =>
          blog.id === blogId
            ? { ...blog, likes: blog.likes - (currentLikeStatus ? -1 : 1) }
            : blog
        )
      );
      setLikedBlogs(prevState => ({
        ...prevState,
        [blogId]: currentLikeStatus,
      }));
    }
  };


  //Dislike handling function
  const handleDislike = async (blogId: string) => {
    const currentDislikeStatus = dislikedBlogs[blogId] || false;
    const blogRef = doc(db, "blogs", blogId);

    // Optimistically update UI first
    setBlogs((prevBlogs: any[]) =>
      prevBlogs.map((blog: any) =>
        blog.id === blogId
          ? { ...blog, dislikes: blog.dislikes + (currentDislikeStatus ? -1 : 1) }
          : blog
      )
    );

    setDislikedBlogs(prevState => ({
      ...prevState,
      [blogId]: !currentDislikeStatus,
    }));

    // Update Firebase
    try {
      await updateDoc(blogRef, {
        dislikes: increment(currentDislikeStatus ? -1 : 1),
      });

      // Reset like if disliked
      if (likedBlogs[blogId]) {
        await updateDoc(blogRef, {
          likes: increment(-1),
        });
        setLikedBlogs(prevState => ({
          ...prevState,
          [blogId]: false,
        }));
      }
    } catch (error) {
      // console.log(`Error updating dislike: ${error}`);
      // Rollback state on error
      setBlogs((prevBlogs: any[]) =>
        prevBlogs.map((blog: any) =>
          blog.id === blogId
            ? { ...blog, dislikes: blog.dislikes - (currentDislikeStatus ? -1 : 1) }
            : blog
        )
      );
      setDislikedBlogs(prevState => ({
        ...prevState,
        [blogId]: currentDislikeStatus,
      }));
    }
  };


  const toggleCommentSec = (blogId: string) => {
    if (expendedBlogId === blogId) {
      setexpendedBlogId(null);
    } else {
      setexpendedBlogId(blogId)
    }
  }

  const closeCommentSec = () => {
    setexpendedBlogId(null)
  }

  // Truncate function to limit the description to one line
  const truncateDescription = (description: string, maxLength = 40) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';  // Add 3 dots if longer
    }
    return description;
  };


  const formatingDate = (unOrderDate: string) => {
    const [year, month, day] = unOrderDate.split("-");
    return `${day}-${month}-${year}`;
  }
  
  return (
    <>
      <Navbar />
      <ToastContainer position='top-center' theme={theme} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <div key={blog.id} className="rounded-xl shadow-md overflow-hidden dark:border-2"
              onMouseEnter={() => { setHoveredBlogId(blog.id) }}
              onMouseLeave={() => {
                setHoveredBlogId(null)
              }}>
              {/* Blog post image */}
              <img src={blog.pic} alt={blog.title} className="w-full h-64 object-fill transition-opacity duration-300 hover:opacity-90" />

              {/* Blog post content */}
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-black dark:to-black">
                {/* Blog post title */}
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{blog.title}</h2>
                  {user?.email === "mromankhan005@gmail.com" && user?.uid === "4cLOtLZVlQgoDaNNFghl5OK5ldl2" ? <div>{hoveredBlogId === blog.id && (<span aria-label='Delete' className='cursor-pointer' onClick={() => { handleDelete(blog.id) }}><MdDelete /></span>)}</div> : ""}
                </div>

                {/* Blog post description */}
                <p className="mb-4 text-gray-700 dark:text-gray-300">{truncateDescription(blog.description)}</p>

                {/* Blog post author and date */}
                <div className="text-sm mb-4 flex justify-between text-gray-600 dark:text-gray-400">
                  <div><span>By Roman</span> | <span>{formatingDate(blog.currentDate)}</span></div>
                  <div className='flex justify-around h-8 w-20'>
                    <span onClick={() => { handleLike(blog.id) }}>{likedBlogs[blog.id] ? <AiFillLike size={25} /> : <AiOutlineLike size={25} />} <span className='ml-2'>{blog.likes}</span> </span>
                    <span onClick={() => { handleDislike(blog.id) }}>{dislikedBlogs[blog.id] ? <AiFillDislike size={25} /> : <AiOutlineDislike size={25} />} <span className='ml-2'>{blog.dislikes}</span> </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {/* Link to the full blog post */}
                  <Link href={`/blogPost/${blog.id}`} className={`${buttonVariants({ variant: "outline" })} transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700`}>Click here</Link>
                  <span onClick={() => { toggleCommentSec(blog.id) }}
                    className="cursor-pointer flex items-center mr-7 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300">
                    <FaRegCommentAlt className="sm:h-4 sm:w-4 md:h-5 md:w-5 lg:w-6 lg:h-6" /></span>
                  {expendedBlogId === blog.id && (<CommentsSec blogId={blog.id} closeFunc={closeCommentSec} />)}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </>
  )
}

export default BlogContent
