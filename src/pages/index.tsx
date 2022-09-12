import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { signIn } from "next-auth/react"
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: '/room',
        permanent: false,
      },
    }
  }

  return { props: {} }
}

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

        <div className="flex justify-center items-center w-ful mt-2">
          <button
            onClick={() => signIn()}
            type="button"
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;

