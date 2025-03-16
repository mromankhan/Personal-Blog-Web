import Navbar from '@/components/Navbar';
import Image from 'next/image';
import TopBlogsSection from './TopBlogs';

const BlogApp = () => {

  return (
    <>
      <Navbar />
      <main>
        <section className="container px-4 py-10 mx-auto lg:h-128 lg:space-x-8 lg:flex lg:items-center mb-20">
          <div className="w-full text-center lg:text-left lg:w-1/2 lg:-mt-8 sm:mb-20">
            <h1 className="text-3xl leading-snug text-gray-800 dark:text-gray-200 md:text-4xl">
              <span className="font-semibold dark:text-blue-500">Welcome</span>  to My Tech Journey!
            </h1>
            <br />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Embark on a thrilling adventure through the ever-evolving world of technology. Dive deep into my experiences, where I share coding tips, insightful tutorials, and in-depth gadget reviews. Witness the future of tech unfold through my eyes—one innovation at a time!
            </p>
          </div>
          <div className="w-full mt-4 lg:mt-0 lg:w-1/2 md:mt-14">
            <Image
              src="/images/homepage.svg"
              alt="import Image from 'next/image"
              width={100}
              height={100}
              className="w-full h-full max-w-md mx-auto"
            />
          </div>
        </section>

        <section>
          <TopBlogsSection />
        </section>
      </main>
    </>
  )
}

export default BlogApp