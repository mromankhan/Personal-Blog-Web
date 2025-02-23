"use client";
import { db } from "@/firebase/firebaseConfig";
import { addDoc, collection, doc, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { UseAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
            console.log("Comment added sucessfully");

        } catch (e) {
            console.error("Adding comment error is", e);
        }
    }
    // add commint in firebase completed end



    // fetch comments with firebase
    // const fetchComments = async (blogId: string) => {
    //     const blogRef = doc(db, "blogs", blogId);
    //     const commentRef = collection(blogRef, "comments");
    //     const commentsQuery = query(commentRef, orderBy("timestamp", "asc"));
    //     try {
    //         const commentsSnap = await getDocs(commentsQuery);
    //         const commentsList = commentsSnap.docs?.map((doc) => ({
    //             id: doc.id,
    //             ...doc.data()
    //         }))
    //         return commentsList;
    //     } catch (e) {
    //         console.error("fetch comments error is", e);
    //         return [];
    //     }
    // }
    // fetch comments with firebase end


    // gpt fetch func
    // Function to fetch comments for a specific blog
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
        } catch (error) {
            console.error("Error fetching comments: ", error);
            return [];
        }
    };
    // gpt fetch func end




    useEffect(() => {
        const loadComments = async () => {
            const commentsList = await fetchComments(blogId);
            setComments(commentsList as Comments[])}
        loadComments()
    }, [blogId]);


    // add comments handle function
    const handleAddComment = async () => {
        if(!user){
            router.push("/login")
        }
        else if (newComment.trim() === "") return;
        await addComment(blogId, newComment);
        setNewComment("");
        const updatedComments = await fetchComments(blogId);
        setComments(updatedComments as Comments[]);
    }
    // add comments handle function end


    return (
        <>

            {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative bg-white w-full max-w-3xl h-full overflow-auto p-6 rounded-lg md:w-3/4 md:h-auto">
                <button 
                    onClick={()=>{}} 
                    className="absolute top-4 right-4 text-white text-2xl font-bold"
                >
                    &times;
                </button>
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                <div className="mb-4">
                    {comments?.map((comment) => (
                        <div className="mb-2" key={comment.id}>
                            <h5 className="font-bold text-black">{comment.authorName}</h5>
                            <p className="text-gray-800">{comment.commentText}</p>
                            <span className="text-gray-500 text-sm">
                                {comment.timestamp.toDate().toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="fixed bottom-0 w-full p-4 shadow-md flex justify-center gap-2">
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Add a Comment" 
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                    <button 
                        onClick={handleAddComment} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div> */}


            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
                <div className="relative bg-white dark:bg-gray-800 w-full max-w-3xl h-full overflow-hidden rounded-lg md:w-3/4 md:h-[85vh] shadow-2xl">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Comments</h3>
                            <button
                                onClick={closeFunc}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                aria-label="Close comments"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
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
                                        {/* <div className="w-10 h-10 mt-3 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0" /> */}
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                {comment.authorName}
                                            </h5>
                                            <p className="text-gray-800 dark:text-gray-200 break-words">
                                                {comment.commentText}
                                            </p>
                                            <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {comment.timestamp.toDate().toLocaleString()}
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
                            {/* <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0" /> */}
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