"use client";
import { db } from "@/firebase/firebaseConfig";
import { addDoc, collection, doc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { UseAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/useThemeStore"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type PropsType = {
    blogId: string,
    closeFunc: () => void
}

type Comments = {
    id: string,
    authorName: string,
    commentText: string,
    timestamp: Timestamp
}

const CommentsSec = ({ blogId, closeFunc }: PropsType) => {

    const { user } = UseAuthStore((state) => state);
    const { theme, detectTheme } = useThemeStore();
    const router = useRouter();

    const [comments, setComments] = useState<Comments[]>();
    const [newComment, setNewComment] = useState("");

    // add commint in firebase
    const addComment = async (blogId: string, commentText: string) => {
        if (!user) return;
        const blogRef = doc(db, "blogs", blogId);
        const commentsRef = collection(blogRef, "comments");
        try {
            await addDoc(commentsRef, {
                authorName: user.displayName || "Anonymous",
                commentText: commentText,
                timestamp: new Date()
            })
            // console.log("Comment added sucessfully"); for dev

        } catch (e) {
            void e;
            // console.error("Adding comment error is", e); for dev
        }
    }

    // fetch commints from firebase
    const fetchComments = async (blogId: string) => {
        const blogRef = doc(db, "blogs", blogId);
        const commentsRef = collection(blogRef, "comments");
        const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"));

        try {
            const commentsSnapshot = await getDocs(commentsQuery);
            const commentsList = commentsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            return commentsList;
        } catch (e) {
            void e;
            // console.error("Error fetching comments: ", error);
            return [];
        }
    };


    useEffect(() => {
        const loadComments = async () => {
            const commentsList = await fetchComments(blogId);
            setComments(commentsList as Comments[])
        }
        loadComments()
    }, [blogId]);

    useEffect(()=>{
        detectTheme()
    },[])

    // add comments handle function
    const handleAddComment = async () => {
        if (!user) {
            setTimeout(() => {
                toast.error("You are not logged in! Please login to comment." , { theme });
            }, 1000);
            router.push("/login")
        }
        else if (newComment.trim() === "") return;
        await addComment(blogId, newComment);
        setNewComment("");
        const updatedComments = await fetchComments(blogId);
        setComments(updatedComments as Comments[]);
    }


    return (
        <>
        
              <ToastContainer position='top-center' />
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
                <div className="relative bg-white dark:bg-gray-800 w-full max-w-3xl h-full overflow-hidden rounded-lg md:w-3/4 md:h-[85vh] shadow-2xl">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Comments</h3>
                            <button onClick={closeFunc} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" aria-label="Close comments">
                                <span className="text-2xl">&times;</span></button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pt-16 pb-24">
                        <div className="px-6 space-y-4 mt-2">
                            {comments?.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                {comment.authorName}
                                            </h5>
                                            <p className="text-gray-800 dark:text-gray-200 break-words">
                                                {comment.commentText}
                                            </p>
                                            <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {comment.timestamp.toDate().toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comment Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 max-w-3xl mx-auto px-2">
                            <div className="flex-1 min-w-0">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Comment..."
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-full
                  bg-gray-50 dark:bg-gray-700/50
                  focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                  focus:border-transparent outline-none transition-all
                  text-gray-800 dark:text-gray-200 
                  placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                            <button
                                onClick={handleAddComment}
                                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
                text-white rounded-full font-medium transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-sm hover:shadow-md flex-shrink-0"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommentsSec