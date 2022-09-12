import type { NextPage } from "next";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import classnames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image"
import useGravatar from "../../hooks/useGravatar";
import { PlusIcon } from "@heroicons/react/20/solid";


const Rooms: NextPage = () => {
  const { data: session } = useSession()
  const avatarUrl = useGravatar(session?.user?.email ?? "", { defaultImage: "robohash" })

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-full bg-white" aria-hidden="true" />
      <div className="relative flex h-screen flex-col">
        {/* Navbar */}
        <Disclosure as="nav" className="flex-shrink-0 bg-white border-b ">
          {() => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                  <div className="flex items-center px-2 lg:px-0 xl:w-64">
                    <div className="flex-shrink-0">
                      <h1 className="text-2xl text-center leading-normal font-extrabold text-gray-700">
                        Collab<span className="text-purple-300">Estate</span>
                      </h1>
                    </div>
                  </div>

                  {/* Links section */}
                  <div className="lg:w-80">
                    <div className="flex items-center justify-end">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <div>
                          <Menu.Button className="flex rounded-full bg-indigo-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                            <span className="sr-only">Open user menu</span>
                            <Image
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full"
                              src={avatarUrl}
                              alt="Your profile picture"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classnames('block px-4 py-2 text-sm text-gray-700', { 'bg-gray-100': active })}
                                >
                                  Logout
                                </a>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>

        <div className="flex h-screen">
          <div className="m-auto text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rooms</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new room.</p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default Rooms