import Navbar from '@/components/Navbar';
import Image from 'next/image';
import TopBlogsSection from './TopBlogs';

const BlogApp = () => {

  return (
    <>
      <Navbar />
      <main>
        <section className="container px-4 py-10 mx-auto lg:h-128 lg:space-x-8 lg:flex lg:items-center">
          <div className="w-full text-center lg:text-left lg:w-1/2 lg:-mt-8">
            <h1 className="text-3xl leading-snug text-gray-800 dark:text-gray-200 md:text-4xl">
              <span className="font-semibold dark:text-blue-500">Welcome</span>  to My Tech Journey!
            </h1>
            <br />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Embark on a thrilling adventure through the ever-evolving world of technology. Dive deep into my experiences, where I share coding tips, insightful tutorials, and in-depth gadget reviews. Witness the future of tech unfold through my eyes—one innovation at a time!
            </p>
          </div>
          <div className="w-full mt-4 lg:mt-0 lg:w-1/2 md:mt-14 sm:mt-14">
            <Image
              src="/images/homepage.svg"
              alt="import Image from 'next/image"
              width={100}
              height={100}
              className="w-full h-full max-w-md mx-auto"
            />
          </div>
        </section>

        {/* clients sec */}
        {/* <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">What Our Clients Say</h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">Hear from our satisfied customers</p>
            </div>
            <div className="flex flex-wrap justify-center">
              Testimonial 1
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 transform transition duration-500 hover:scale-105 text-center">
                  <p className="text-gray-600 dark:text-gray-400">"This service has been a game-changer for our business. Highly recommend!"</p>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Jack wilsom</h3>
                  <p className="text-gray-500 dark:text-gray-300">CEO, Company Inovatrix Tech</p>
                </div>
              </div>
              Testimonial 2
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 transform transition duration-500 hover:scale-105 text-center">
                  <p className="text-gray-600 dark:text-gray-400">"Amazing experience! The team was professional and the results were outstanding."</p>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">James hoe</h3>
                  <p className="text-gray-500 dark:text-gray-300">Marketing Director, Company @Tech</p>
                </div>
              </div>
              Testimonial 3
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 transform transition duration-500 hover:scale-105 text-center">
                  <p className="text-gray-600 dark:text-gray-400">"Exceptional service and support. We couldn't be happier with the results."</p>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Oscar Brown</h3>
                  <p className="text-gray-500 dark:text-gray-300">CTO, Company Techverx</p>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <section>
          <TopBlogsSection />
        </section>
      </main>
    </>
  )
}

export default BlogApp