/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
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
import { MdDelete, MdEdit } from "react-icons/md";
import { Loader, MoreVertical } from "lucide-react";
import { UseAuthStore } from '@/store/useAuthStore';
import { deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/store/useThemeStore';


const BlogContent = () => {

  const router = useRouter();
  const { user } = UseAuthStore((state) => state);
  const { theme, detectTheme } = useThemeStore();
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID


  const [blogs, setBlogs] = useState<any>([]);
  const [likedBlogs, setLikedBlogs] = useState<{ [key: string]: boolean }>({});
  const [dislikedBlogs, setDislikedBlogs] = useState<{ [key: string | ""]: boolean }>({});
  const [expendedBlogId, setexpendedBlogId] = useState<string | null>(null);
  const [hoveredBlogId, setHoveredBlogId] = useState<string | null>(null);




  const fetchBlogs = async () => {
    try {
      const blogRef = collection(db, "blogs");
      const snapshot = await getDocs(blogRef);
      const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogList);
    } catch (e) {
      void e;
      // console.error(`Data fetching error ${e}`); for dev
    }
  }


  useEffect(() => {
    detectTheme();
  }, [])

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
        void e;
        // console.error(`blog delete function error is ${e}`);   for dev
      }
    } else {
      // console.log("blog id is not available"); for dev
    }
  }


  const handleEdit = (blog: any) => {
    router.push(`/create-blog?blogId=${blog.id}`); // Blog ID pass kar rahe hain
  };



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
    } catch (e) {
      void e;
      // console.error(`Error updating like: ${e}`); for dev
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
    } catch (e) {
      void e;
      // console.error(`Error updating dislike: ${e}`); for dev
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

  if (blogs.length === 0) {
    return <div className="flex items-center justify-center h-screen"><Loader className="size-20 animate-spin" /></div>;
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
              {/* <img src={blog.pic} alt={blog.title} className="w-full h-64 object-fill transition-opacity duration-300 hover:opacity-90" /> */}
              <Image
                src={blog.pic}
                alt={blog.title}
                width={500} // Adjust width as needed
                height={256} // Adjust height as needed
                className="w-full h-64 object-cover rounded-t-xl transition-opacity duration-300 hover:opacity-90"
              />


              {/* Blog post content */}
              <div className="p-4 dark:from-black dark:to-black">
                {/* Blog post title */}
                <div className="flex justify-between">
                  <u><h2 className="text-2xl font-bold mb-2 italic text-gray-800 dark:text-gray-100">{blog.title}</h2></u>
                  {user?.email === ADMIN_EMAIL && user?.uid === ADMIN_ID ? <div>{hoveredBlogId === blog.id && (<div className="dropdown dropdown-bottom dropdown-end transition-all">
                    <div tabIndex={0} role="button" className="m-1"><MoreVertical size={20} /></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm dark:bg-zinc-900">
                      <li aria-label='Edit' onClick={() => { handleEdit(blog) }}><a><MdEdit size={18} /> Edit</a></li>
                      <li aria-label='Delete' onClick={() => { handleDelete(blog.id) }}><a><MdDelete size={18} /> Delete</a></li>
                    </ul>
                  </div>)}</div> : ""}
                </div>

                {/* Blog post description */}
                <p className="mb-4 text-gray-700 dark:text-gray-300"><ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-3xl font-bold my-4" {...props} />,
                    h2: (props) => <h2 className="text-2xl font-semibold my-3" {...props} />,
                    h3: (props) => <h3 className="text-xl font-medium my-2" {...props} />,
                    p: (props) => <p className="text-gray-700 leading-6 my-2" {...props} />,
                  }}
                >{truncateDescription(blog.description)}</ReactMarkdown></p>

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
                  <Link href={`/blogPost/${blog.id}`} className={`${buttonVariants({ variant: "outline" })} transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700`}>Read More</Link>
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
