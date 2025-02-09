// "use client";
// import CommentsSec from '@/components/CommentsSec';
// import Loader from '@/components/Loader';
// import Navbar from '@/components/Navbar';
// import { buttonVariants } from '@/components/ui/button';
// import { db } from '@/firebase/firebaseConfig';
// import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { AiOutlineLike } from "react-icons/ai";
// import { AiFillLike } from "react-icons/ai";
// import { AiOutlineDislike } from "react-icons/ai";
// import { AiFillDislike } from "react-icons/ai";
// import { FaRegCommentAlt } from "react-icons/fa";
// import BlogOptions from '../blogOptions';


// const BlogContent = () => {

//   const [isLoading, setIsLoading] = useState(true);
//   const [blogs, setBlogs] = useState<any>([]);
//   const [likedBlogs, setLikedBlogs] = useState<{ [key: string]: boolean }>({});
//   const [dislikedBlogs, setDislikedBlogs] = useState<{ [key: string]: boolean }>({});
//   const [expendedBlogId, setexpendedBlogId] = useState<string | null>(null);
//   const [showDots, setShowDots] = useState(false); // Dots ke liye state
//   const [showOptions, setShowOptions] = useState(false); // Options ke liye state
//   const [hoveredBlogId, setHoveredBlogId] = useState<string | null>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [])


//   const fetchBlogs = async () => {
//     try {
//       const blogRef = collection(db, "blogs");
//       const snapshot = await getDocs(blogRef);
//       const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setBlogs(blogList);
//     } catch (error) {
//       console.log(`Data fetching error ${error}`);
//     }
//   }


//   useEffect(() => {
//     fetchBlogs();
//   }, [])

//   const handleDelete = () => {

//   }

//   const handleEdit = () => {

//   }


//   const handleLike = async (blogId: string) => {
//     const currentLikeStatus = likedBlogs[blogId] || false;
//     const blogRef = doc(db, "blogs", blogId);

//     // Optimistically update UI first
//     setBlogs((prevBlogs: any[]) =>
//       prevBlogs.map((blog: any) =>
//         blog.id === blogId
//           ? { ...blog, likes: blog.likes + (currentLikeStatus ? -1 : 1) }
//           : blog
//       )
//     );

//     setLikedBlogs(prevState => ({
//       ...prevState,
//       [blogId]: !currentLikeStatus,
//     }));

//     // Update Firebase
//     try {
//       await updateDoc(blogRef, {
//         likes: increment(currentLikeStatus ? -1 : 1),
//       });

//       // Reset dislike if liked
//       if (dislikedBlogs[blogId]) {
//         await updateDoc(blogRef, {
//           dislikes: increment(-1),
//         });
//         setDislikedBlogs(prevState => ({
//           ...prevState,
//           [blogId]: false,
//         }));
//       }
//     } catch (error) {
//       console.log(`Error updating like: ${error}`);
//       // Rollback state on error
//       setBlogs((prevBlogs: any[]) =>
//         prevBlogs.map((blog: any) =>
//           blog.id === blogId
//             ? { ...blog, likes: blog.likes - (currentLikeStatus ? -1 : 1) }
//             : blog
//         )
//       );
//       setLikedBlogs(prevState => ({
//         ...prevState,
//         [blogId]: currentLikeStatus,
//       }));
//     }
//   };


//   //Dislike handling function
//   const handleDislike = async (blogId: string) => {
//     const currentDislikeStatus = dislikedBlogs[blogId] || false;
//     const blogRef = doc(db, "blogs", blogId);

//     // Optimistically update UI first
//     setBlogs((prevBlogs: any[]) =>
//       prevBlogs.map((blog: any) =>
//         blog.id === blogId
//           ? { ...blog, dislikes: blog.dislikes + (currentDislikeStatus ? -1 : 1) }
//           : blog
//       )
//     );

//     setDislikedBlogs(prevState => ({
//       ...prevState,
//       [blogId]: !currentDislikeStatus,
//     }));

//     // Update Firebase
//     try {
//       await updateDoc(blogRef, {
//         dislikes: increment(currentDislikeStatus ? -1 : 1),
//       });

//       // Reset like if disliked
//       if (likedBlogs[blogId]) {
//         await updateDoc(blogRef, {
//           likes: increment(-1),
//         });
//         setLikedBlogs(prevState => ({
//           ...prevState,
//           [blogId]: false,
//         }));
//       }
//     } catch (error) {
//       console.log(`Error updating dislike: ${error}`);
//       // Rollback state on error
//       setBlogs((prevBlogs: any[]) =>
//         prevBlogs.map((blog: any) =>
//           blog.id === blogId
//             ? { ...blog, dislikes: blog.dislikes - (currentDislikeStatus ? -1 : 1) }
//             : blog
//         )
//       );
//       setDislikedBlogs(prevState => ({
//         ...prevState,
//         [blogId]: currentDislikeStatus,
//       }));
//     }
//   };


//   const toggleCommentSec = (blogId: string) => {
//     if (expendedBlogId === blogId) {
//       setexpendedBlogId(null);
//     } else {
//       setexpendedBlogId(blogId)
//     }
//   }

//   const closeCommentSec = () => {
//     setexpendedBlogId(null)
//   }

//   // Truncate function to limit the description to one line
//   const truncateDescription = (description: string, maxLength = 50) => {
//     if (description.length > maxLength) {
//       return description.slice(0, maxLength) + '...';  // Add 3 dots if longer
//     }
//     return description;
//   };


//   const formatingDate = (unOrderDate: string) => {
//     const [year, month, day] = unOrderDate.split("-");
//     return `${day}-${month}-${year}`;
//   }

//   if (isLoading) {
//     return <Loader />
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="container mx-auto p-4">
//         {/* Main heading for the blog section */}
//         <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {blogs.map((blog: any) => (
//             //rounded-xl shadow-lg overflow-hidden dark:border-2 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl
//             <div key={blog.id} className="rounded-xl shadow-md overflow-hidden dark:border-2"
//               onMouseEnter={() => { setShowDots(true) }}
//               onMouseLeave={() => {
//                 setShowDots(false)
//                 setShowOptions(false)
//               }}>
//               {/* Blog post image */}
//               <img src={blog.pic} alt={blog.title} className="w-full h-64 object-fill  transition-opacity duration-300 hover:opacity-90" />

//               {/* Blog post content */}
//               <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-black dark:to-black">
//                 {/* Blog post title */}
//                 <div className="flex justify-evenly">
//                   <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{blog.title}</h2>
//                   <span>{showDots && (<div><span className='text-gray-600 text-xl'
//                     onClick={() => { setShowOptions((prev)=>!prev) }}>⋮</span>

//                     {showOptions && (<div className="">
//                       <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={handleEdit}>Edit</button>
//                       <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={handleDelete}>Delete</button></div>)}
//                   </div>)}</span>
//                 </div>

//                 {/* Blog post description */}
//                 <p className="mb-4 text-gray-700 dark:text-gray-300">{truncateDescription(blog.description, 50)}</p>

//                 {/* Blog post author and date */}
//                 <div className="text-sm mb-4 flex justify-between text-gray-600 dark:text-gray-400">
//                   <div><span>By Roman</span> | <span>{formatingDate(blog.currentDate)}</span></div>
//                   <div className='flex justify-around h-8 w-20'>
//                     <span onClick={() => { handleLike(blog.id) }}>{likedBlogs[blog.id] ? <AiFillLike size={25} /> : <AiOutlineLike size={25} />} <span className='ml-2'>{blog.likes}</span> </span>
//                     <span onClick={() => { handleDislike(blog.id) }}>{dislikedBlogs[blog.id] ? <AiFillDislike size={25} /> : <AiOutlineDislike size={25} />} <span className='ml-2'>{blog.dislikes}</span> </span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   {/* Link to the full blog post */}
//                   <Link href={`/blogPost/${blog.id}`} className={`${buttonVariants({ variant: "outline" })} transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700`}>Click here</Link>
//                   <span onClick={() => { toggleCommentSec(blog.id) }}
//                     className="cursor-pointer flex items-center mr-7 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300">
//                     <FaRegCommentAlt className="sm:h-4 sm:w-4 md:h-5 md:w-5 lg:w-6 lg:h-6" /></span>
//                   {expendedBlogId === blog.id && (<CommentsSec blogId={blog.id} closeFunc={closeCommentSec} />)}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>

//     </>
//   )
// }

// export default BlogContent













// "use client";
// import CommentsSec from '@/components/CommentsSec';
// import Loader from '@/components/Loader';
// import Navbar from '@/components/Navbar';
// import { buttonVariants } from '@/components/ui/button';
// import { db } from '@/firebase/firebaseConfig';
// import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { AiOutlineLike } from "react-icons/ai";
// import { AiFillLike } from "react-icons/ai";
// import { AiOutlineDislike } from "react-icons/ai";
// import { AiFillDislike } from "react-icons/ai";
// import { FaRegCommentAlt } from "react-icons/fa";
// import BlogOptions from '../blogOptions';


// const BlogContent = () => {

//   const [isLoading, setIsLoading] = useState(true);
//   const [blogs, setBlogs] = useState<any>([]);
//   const [likedBlogs, setLikedBlogs] = useState<{ [key: string]: boolean }>({});
//   const [dislikedBlogs, setDislikedBlogs] = useState<{ [key: string | ""]: boolean }>({});
//   const [expendedBlogId, setexpendedBlogId] = useState<string | null>(null);
//   const [showOptions, setShowOptions] = useState<{[key: string]: boolean}>({}); // Options ke liye state
//   const [hoveredBlogId, setHoveredBlogId] = useState<string | null>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [])


//   const fetchBlogs = async () => {
//     try {
//       const blogRef = collection(db, "blogs");
//       const snapshot = await getDocs(blogRef);
//       const blogList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setBlogs(blogList);
//     } catch (error) {
//       console.log(`Data fetching error ${error}`);
//     }
//   }


//   useEffect(() => {
//     fetchBlogs();
//   }, [])

//   const handleDelete = () => {

//   }

//   const handleEdit = () => {

//   }


//   const handleLike = async (blogId: string) => {
//     const currentLikeStatus = likedBlogs[blogId] || false;
//     const blogRef = doc(db, "blogs", blogId);

//     // Optimistically update UI first
//     setBlogs((prevBlogs: any[]) =>
//       prevBlogs.map((blog: any) =>
//         blog.id === blogId
//           ? { ...blog, likes: blog.likes + (currentLikeStatus ? -1 : 1) }
//           : blog
//       )
//     );

//     setLikedBlogs(prevState => ({
//       ...prevState,
//       [blogId]: !currentLikeStatus,
//     }));

//     // Update Firebase
//     try {
//       await updateDoc(blogRef, {
//         likes: increment(currentLikeStatus ? -1 : 1),
//       });

//       // Reset dislike if liked
//       if (dislikedBlogs[blogId]) {
//         await updateDoc(blogRef, {
//           dislikes: increment(-1),
//         });
//         setDislikedBlogs(prevState => ({
//           ...prevState,
//           [blogId]: false,
//         }));
//       }
//     } catch (error) {
//       console.log(`Error updating like: ${error}`);
//       // Rollback state on error
//       setBlogs((prevBlogs: any[]) =>
//         prevBlogs.map((blog: any) =>
//           blog.id === blogId
//             ? { ...blog, likes: blog.likes - (currentLikeStatus ? -1 : 1) }
//             : blog
//         )
//       );
//       setLikedBlogs(prevState => ({
//         ...prevState,
//         [blogId]: currentLikeStatus,
//       }));
//     }
//   };


//   //Dislike handling function
//   const handleDislike = async (blogId: string) => {
//     const currentDislikeStatus = dislikedBlogs[blogId] || false;
//     const blogRef = doc(db, "blogs", blogId);

//     // Optimistically update UI first
//     setBlogs((prevBlogs: any[]) =>
//       prevBlogs.map((blog: any) =>
//         blog.id === blogId
//           ? { ...blog, dislikes: blog.dislikes + (currentDislikeStatus ? -1 : 1) }
//           : blog
//       )
//     );

//     setDislikedBlogs(prevState => ({
//       ...prevState,
//       [blogId]: !currentDislikeStatus,
//     }));

//     // Update Firebase
//     try {
//       await updateDoc(blogRef, {
//         dislikes: increment(currentDislikeStatus ? -1 : 1),
//       });

//       // Reset like if disliked
//       if (likedBlogs[blogId]) {
//         await updateDoc(blogRef, {
//           likes: increment(-1),
//         });
//         setLikedBlogs(prevState => ({
//           ...prevState,
//           [blogId]: false,
//         }));
//       }
//     } catch (error) {
//       console.log(`Error updating dislike: ${error}`);
//       // Rollback state on error
//       setBlogs((prevBlogs: any[]) =>
//         prevBlogs.map((blog: any) =>
//           blog.id === blogId
//             ? { ...blog, dislikes: blog.dislikes - (currentDislikeStatus ? -1 : 1) }
//             : blog
//         )
//       );
//       setDislikedBlogs(prevState => ({
//         ...prevState,
//         [blogId]: currentDislikeStatus,
//       }));
//     }
//   };


//   const toggleCommentSec = (blogId: string) => {
//     if (expendedBlogId === blogId) {
//       setexpendedBlogId(null);
//     } else {
//       setexpendedBlogId(blogId)
//     }
//   }

//   const closeCommentSec = () => {
//     setexpendedBlogId(null)
//   }

//   // Truncate function to limit the description to one line
//   const truncateDescription = (description: string, maxLength = 50) => {
//     if (description.length > maxLength) {
//       return description.slice(0, maxLength) + '...';  // Add 3 dots if longer
//     }
//     return description;
//   };


//   const formatingDate = (unOrderDate: string) => {
//     const [year, month, day] = unOrderDate.split("-");
//     return `${day}-${month}-${year}`;
//   }

//   if (isLoading) {
//     return <Loader />
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="container mx-auto p-4">
//         {/* Main heading for the blog section */}
//         <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {blogs.map((blog: any) => (
//             //rounded-xl shadow-lg overflow-hidden dark:border-2 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl
//             <div key={blog.id} className="rounded-xl shadow-md overflow-hidden dark:border-2"
//               onMouseEnter={() => { setHoveredBlogId(blog.id) }}
//               onMouseLeave={() => {
//                 setHoveredBlogId(null)}}>
//               {/* Blog post image */}
//               <img src={blog.pic} alt={blog.title} className="w-full h-64 object-fill  transition-opacity duration-300 hover:opacity-90" />

//               {/* Blog post content */}
//               <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-black dark:to-black">
//                 {/* Blog post title */}
//                 <div className="flex justify-evenly">
//                   <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{blog.title}</h2>
//                   <span>{hoveredBlogId === blog.id && (<div><span className='text-gray-600 text-xl'
//                     onClick={() => setShowOptions((prev)=>({
//                       ...prev,
//                       [blog.id]: !prev[blog.id]
//                     })) }
//                     aria-expanded={showOptions[blog.id] || false}
//                     aria-label=''>⋮</span>

//                     {showOptions[blog.id] && (<div className="">
//                       <span  onClick={handleEdit}>Edit</span>
//                       <span onClick={handleDelete}>Delete</span></div>)}
//                   </div>)}</span>
//                 </div>

//                 {/* Blog post description */}
//                 <p className="mb-4 text-gray-700 dark:text-gray-300">{truncateDescription(blog.description, 50)}</p>

//                 {/* Blog post author and date */}
//                 <div className="text-sm mb-4 flex justify-between text-gray-600 dark:text-gray-400">
//                   <div><span>By Roman</span> | <span>{formatingDate(blog.currentDate)}</span></div>
//                   <div className='flex justify-around h-8 w-20'>
//                     <span onClick={() => { handleLike(blog.id) }}>{likedBlogs[blog.id] ? <AiFillLike size={25} /> : <AiOutlineLike size={25} />} <span className='ml-2'>{blog.likes}</span> </span>
//                     <span onClick={() => { handleDislike(blog.id) }}>{dislikedBlogs[blog.id] ? <AiFillDislike size={25} /> : <AiOutlineDislike size={25} />} <span className='ml-2'>{blog.dislikes}</span> </span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   {/* Link to the full blog post */}
//                   <Link href={`/blogPost/${blog.id}`} className={`${buttonVariants({ variant: "outline" })} transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700`}>Click here</Link>
//                   <span onClick={() => { toggleCommentSec(blog.id) }}
//                     className="cursor-pointer flex items-center mr-7 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300">
//                     <FaRegCommentAlt className="sm:h-4 sm:w-4 md:h-5 md:w-5 lg:w-6 lg:h-6" /></span>
//                   {expendedBlogId === blog.id && (<CommentsSec blogId={blog.id} closeFunc={closeCommentSec} />)}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>

//     </>
//   )
// }

// export default BlogContent










// 1. What is HTML?
// HTML (HyperText Markup Language) is the standard language used to create webpages and web applications. It provides the structure of a webpage by using a series of elements and tags. HTML elements define things like headings, paragraphs, images, links, and more.

// 2. HTML Structure
// Every HTML page follows a basic structure, which includes:

// • Document Type Declaration (<!DOCTYPE html>): This tells the browser that the document is written in HTML5.
// • Root element (<html>): The <html> tag wraps the entire content of the page.
// • Head section (<head>): Contains meta-information about the webpage, such as the title of the page, links to stylesheets, and other metadata.
// • Body section (<body>): Contains the content of the page, such as text, images, and other elements that users interact with.
// 3. HTML Tags
// HTML uses tags to define content and structure. Tags come in pairs:

// • Opening tag (<tagname>): This starts an element.
// • Closing tag (</tagname>): This ends the element.
// Some HTML elements, like images or links, may use self-closing tags, which do not require a closing tag.

// 4. Types of HTML Tags
// • Headings: Headings define titles and sub-titles of content. They range from <h1> (most important) to <h6> (least important). They help structure the content and make it readable.
// • Paragraphs: Paragraph tags <p> are used for text content. They separate different sections of text.
// • Links: Links are defined using the <a> tag. They allow users to navigate from one page to another.
// • Images: The <img> tag is used to display images. You provide the image URL with the src attribute.
// • Lists: HTML allows both ordered lists (<ol>) and unordered lists (<ul>) to organize content. Each list item is defined with a <li> tag.
// 5. Attributes in HTML
// HTML tags can have attributes that provide additional information about an element. Some common attributes include:

// • class: Specifies one or more class names for an element (used for styling).
// • id: Identifies an element uniquely on the page.
// • href: Defines the URL for a link.
// • src: Specifies the source of an image or media file.
// • alt: Provides a description of an image for accessibility.
// 6. Why is HTML Important?
// HTML is the backbone of web development. Without HTML, web browsers wouldn't know how to display or interpret web content. It gives structure and organizes the content of a webpage, making it easy for developers to build and for users to navigate.

// 7. HTML and CSS
// HTML by itself is used for structuring content, while CSS (Cascading Style Sheets) is used for styling and layout. CSS makes web pages visually appealing, while HTML provides the content.

// 8. HTML and JavaScript
// HTML works alongside JavaScript to add interactivity to a webpage. While HTML is responsible for the structure, JavaScript adds dynamic features like user interactions, animations, and more.

// 9. Accessibility and Semantic HTML
// • Semantic HTML involves using meaningful tags (like <article>, <header>, <footer>) to structure content logically, improving the readability and accessibility of a website.
// • Accessibility ensures that websites can be used by people with disabilities. For example, using proper image descriptions with the alt attribute helps screen readers interpret the content for visually impaired users.

