"use client";
import { UseAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type CreateBlogProtectedType = {
    children: React.ReactNode;
}


const CreateBlogProtected = ({ children }: CreateBlogProtectedType) => {

    const router = useRouter();
    const { user } = UseAuthStore((state) => state);

    useEffect(() => {
        if (user?.email !== "mromankhan005@gmail.com" && user?.uid !== "4cLOtLZVlQgoDaNNFghl5OK5ldl2") {
            router.push("/");
        }
    }, [user]);

    return <>{children}</>
}

export default CreateBlogProtected