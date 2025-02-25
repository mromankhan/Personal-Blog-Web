"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from './Theme-btn';
import { UseAuthStore } from '@/store/useAuthStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';


const Navbar = () => {

  const router = useRouter();
  const { user } = UseAuthStore((state) => state);
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Signout sucessfull");
      router.push("/");
    } catch (e) {
      console.error("Logout error is", e)
    }
  }

  return (
    <nav className="p-4 bg-background/50 sticky top-0 backdrop-blur border-b z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"}><div className="container mx-auto flex justify-between items-center font-semibold text-2xl">
          Roman&apos;s Blog
        </div></Link>
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
            Home
          </Link>
          <Link href="/about" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
            About
          </Link>
          <Link href="/blog" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
            Blog
          </Link>
          <Link href="/contact" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
            Contact
          </Link>
          {user?.email === ADMIN_EMAIL && user?.uid === ADMIN_ID ?
            <Link href="/create-blog" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
              Create Blog</Link> : ""}
          <div className='flex items-center'>
            {user ? <span><Button className="mx-1" variant="outline" onClick={handleLogout}>Logout</Button></span> :
              <span><Link href={'/login'}><Button className="mx-1" variant="outline">Login</Button></Link>
                <Link href={'/signup'}><Button className="mx-1 mr-2" variant="outline">Signup</Button></Link> </span>}
            <ModeToggle />
          </div>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader className="flex items-center">
                <SheetTitle className="font-bold my-4">Roman&apos;s Blog</SheetTitle>
                <SheetDescription>
                  <div className='flex flex-col items-center gap-6'>
                    <Link href="/" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
                      Home
                    </Link>
                    <Link href="/about" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
                      About
                    </Link>
                    <Link href="/blog" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
                      Blog
                    </Link>
                    <Link href="/contact" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
                      Contact
                    </Link>
                    {user?.email === ADMIN_EMAIL && user?.uid === ADMIN_ID ?
                      <Link href="/create-blog" className="hover:scale-105 hover:font-semibold transition-transform duration-300">
                        Create Blog</Link> : ""}
                    <div className='flex items-center'>
                      {user ? <span><Button className="mx-1" variant="outline" onClick={handleLogout}>Logout</Button></span> :
                        <span><Link href={"/login"}><Button className="mx-1" variant="outline">Login</Button></Link>
                          <Link href={"/signup"}><Button className="mx-1 mr-2" variant="outline">Signup</Button></Link></span>}
                      <ModeToggle />
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
