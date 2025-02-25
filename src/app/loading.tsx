const loading = () => {
  return (
    <section className="flex items-center justify-center h-screen w-full bg-gray-50 dark:bg-black transition-colors">
      <div className="h-5 w-5 rounded-full bg-blue-300 dark:bg-blue-500 animate-[pulse_1.5s_infinite_ease-in-out]"></div>
      <div className="h-5 w-5 rounded-full bg-blue-300 dark:bg-blue-500 animate-[pulse_1.5s_infinite_ease-in-out] ml-2 animate-delay-150"></div>
      <div className="h-5 w-5 rounded-full bg-blue-300 dark:bg-blue-500 animate-[pulse_1.5s_infinite_ease-in-out] ml-2 animate-delay-300"></div>
      <div className="h-5 w-5 rounded-full bg-blue-300 dark:bg-blue-500 animate-[pulse_1.5s_infinite_ease-in-out] ml-2 animate-delay-450"></div>
      <div className="h-5 w-5 rounded-full bg-blue-300 dark:bg-blue-500 animate-[pulse_1.5s_infinite_ease-in-out] ml-2 animate-delay-600"></div>
    </section>
  );
};

export default loading;
