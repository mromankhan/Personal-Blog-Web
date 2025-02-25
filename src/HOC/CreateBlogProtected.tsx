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
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID

    useEffect(() => {
        if (user?.email !== ADMIN_EMAIL && user?.uid !== ADMIN_ID) {
            router.push("/");
        }
    }, [user]);

    return <>{children}</>
}

export default CreateBlogProtected