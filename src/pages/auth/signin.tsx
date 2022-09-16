import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next"
import { getCsrfToken } from "next-auth/react"
import React from "react"

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}
const SignIn: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ csrfToken }) => {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8" >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-2xl text-center leading-normal font-extrabold text-gray-700">
          Collab<span className="text-purple-300">Estate</span>
        </h1>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in using your email</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" method="post" action="/api/auth/signin/email">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default SignIn;

