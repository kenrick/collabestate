import type { NextPage } from "next";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3CenterLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import classnames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "../../../../hooks/useUser";
import { trpc } from "../../../../utils/trpc";
import Avatar from "../../../../components/Avatar";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Realtime, { RealtimeWrapper } from "../../../../components/Realtime";

const PropertyPage: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const { data, isFetching } = trpc.useQuery(["listing.byId", {
    propertyId: router.query.pid as string
  }], { refetchOnWindowFocus: false, });

  if (!user?.email) {
    return <Loading />
  }

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-1/2 bg-white" aria-hidden="true" />
      <div className="fixed top-0 right-0 h-full w-1/2 bg-gray-50" aria-hidden="true" />
      <div className="relative flex min-h-screen flex-col">
        <Disclosure as="nav" className="flex-shrink-0 bg-white border-b ">
          {({ open }) => (
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
                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-purple-600 p-2 text-indigo-400 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3CenterLeftIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>

                  {/* Links section */}
                  <div className="hidden lg:block lg:w-80">
                    <div className="flex items-center justify-end">
                      <div className="flex">
                        <Link
                          href="/room"
                        >
                          <a className="rounded-md px-3 py-2 text-sm font-medium text-black">Rooms</a>
                        </Link>
                      </div>
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <div>
                          <Menu.Button className="flex rounded-full bg-purple-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                            <span className="sr-only">Open user menu</span>
                            <Avatar className="h-8 w-8 rounded-full" email={user?.email} />
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
        </Disclosure >
        <RealtimeWrapper email={user.email} roomId={router.query.id as string}>
          <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
            <div className="min-w-0 flex-1 bg-white xl:flex" >
              <div className="w-full px-2 py-2 h-screen overflow-scroll">
                {isFetching ? <Loading /> :
                  <div>
                    <Link href={`/room/${router.query.id}`}>
                      <div className="space-x-2 my-5 cursor-pointer">
                        <ArrowLeftIcon className="w-6 h-6 text-purple-500 inline-block" />
                        <span className="text-gray-800 align-middle">Back to listings</span>
                      </div>
                    </Link>
                    <Carousel showIndicators={false} showThumbs={false}>
                      {data?.properties[0]?.photos.map(photo => (
                        <div key={photo.href} className="h-96">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="object-cover h-full w-full" src={photo.href} alt="" />
                        </div>
                      ))}
                    </Carousel>

                    <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-4 w-1/2">
                      <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-medium leading-6 text-purple-500">${data?.properties[0]?.price.toLocaleString("en-US")}</h2>
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Beds</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data?.properties[0]?.beds}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Baths</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data?.properties[0]?.baths}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data?.properties[0]?.address.line}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Neighborhood</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data?.properties[0]?.address.neighborhood_name}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Building Size</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data?.properties[0]?.building_size?.size} {data?.properties[0]?.building_size?.units}</dd>
                          </div>

                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{data?.properties[0]?.prop_type}</dd>
                          </div>

                        </dl>
                      </div>
                    </div>
                  </div>}
              </div>
            </div>

            <div className="bg-gray-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
              <div className="h-full py-6 pl-6 lg:w-80">
                {/* Start right column area */}
                <div className="relative h-full" style={{ minHeight: '16rem' }}>
                  {user?.email &&
                    <Realtime email={user.email} roomId={router.query.id as string} />
                  }
                </div>
                {/* End right column area */}
              </div>
            </div>
          </div>
        </RealtimeWrapper>
      </div>
    </>
  )
}

export default PropertyPage


const Loading = () => {
  return <div role="status" className="flex justify-center pt-10">
    <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
}