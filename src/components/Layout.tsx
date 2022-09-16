import { FC, Fragment } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import classnames from "classnames"
import Avatar from "./Avatar"
import useUser from "../hooks/useUser"
import Loading from "./Loading"
import { signOut } from "next-auth/react"

export interface LayoutProps {
  children: JSX.Element,
  links?: JSX.Element | JSX.Element[]
  extra?: JSX.Element | JSX.Element[]
  splitBackground?: boolean
}


const Layout: FC<LayoutProps> = ({ children, splitBackground = true, links, extra }) => {

  const { user } = useUser();

  if (!user?.email) {
    return <Loading />
  }

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-full bg-white" aria-hidden="true" />
      {splitBackground && <div className="fixed top-0 right-0 h-full w-1/2 bg-gray-50" aria-hidden="true" />}
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

                  {extra && extra}

                  {/* Links section */}
                  <div className="lg:w-80">
                    <div className="flex items-center justify-end">
                      {links && <div className="flex">
                        {links}
                      </div>}
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <div>
                          <Menu.Button className="flex rounded-full bg-purple-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
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
                                  onClick={() => signOut()}
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

        {children}
      </div>
    </>
  )
}

export default Layout