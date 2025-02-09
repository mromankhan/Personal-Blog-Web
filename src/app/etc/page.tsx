// "use client";
// import Navbar from '@/components/Navbar';
// import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Default theme

//   useEffect(() => {
//     // Function to detect theme
//     const detectTheme = () => {
//       const dataTheme = document.documentElement.getAttribute('data-theme');
//       const classTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

//       // Prefer `data-theme`, fallback to class-based
//       const currentTheme = dataTheme || classTheme;
//       setTheme(currentTheme === 'dark' ? 'dark' : 'light');
//     };

//     // Initial detection
//     detectTheme();

//     // Listen for changes to `data-theme` or class attribute
//     const observer = new MutationObserver(detectTheme);
//     observer.observe(document.documentElement, { attributes: true });

//     return () => observer.disconnect(); // Cleanup observer
//   }, []);

//   const notify = () => {
//     toast(`This is a ${theme} themed toast!`, {
//       theme: theme, // Dynamically set toast theme
//     });
//   };

//   return (
//     <div>
//       <Navbar />
//       <button onClick={notify} className="px-4 py-2 bg-blue-500 text-white rounded">
//         Show Toast
//       </button>
//       <ToastContainer position="bottom-right" theme={theme} />
//     </div>
//   );
// }

// export default App;
