import CreateBlogProtected from "@/HOC/CreateBlogProtected";
import { ReactNode } from "react";

type CreateBlogLayoutType = {
  children: ReactNode;
}

export default function CreateBlog({children}: CreateBlogLayoutType) {
  return (
    <CreateBlogProtected>
      {children}
    </CreateBlogProtected>
  )
}
