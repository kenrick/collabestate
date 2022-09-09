import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>CollabEstate</title>
        <meta name="description" content="Find your next home with ease" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Collab<span className="text-purple-300">Estate</span>
        </h1>
        <div className="flex justify-center items-center w-full">
          Find your next home with ease!
        </div>
      </main>
    </>
  );
};

export default Home;

