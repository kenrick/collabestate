import type { NextPage } from "next";
import { Fragment, useEffect, useRef, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3CenterLeftIcon, XMarkIcon, HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import classnames from "classnames";
import Link from "next/link";
import useUser from "../../../hooks/useUser";
import { trpc } from "../../../utils/trpc";
import { formatDistanceStrict } from "date-fns";
import { RadioGroup } from '@headlessui/react'
import classNames from "classnames";
import { Controller, useForm } from "react-hook-form";
import Avatar from "../../../components/Avatar";
import { useRouter } from "next/router";
import Realtime from "../../../components/Realtime";

type SearchType = "sale" | "rent"

const roomOptions = ["1", "2", "3", "4", "5"]

interface FilterValues {
  bedrooms?: string
  bathrooms?: string
  price_max?: string
  price_min?: string
  prop_sub_type?: boolean | Array<string>
  prop_type?: boolean | Array<'single_family' | 'condo' | 'multi_family'>
}

const Room: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const searchInput = useRef<HTMLInputElement>(null)
  const [searchType, setSearchType] = useState<SearchType>('sale')
  const [searchText, setSearchText] = useState('')
  const [filters, setFilters] = useState<FilterValues>({})
  const { data, isFetching } = trpc.useQuery(["listing.search", {
    searchType,
    input: searchText,
    price_max: filters?.price_max,
    price_min: filters?.price_min,
    baths_min: filters?.bathrooms,
    beds_min: filters?.bedrooms,
    prop_type: Array.isArray(filters.prop_type) ? filters.prop_type : [],
    prop_sub_type: Array.isArray(filters.prop_sub_type) ? filters.prop_sub_type : [],
  }], { refetchOnWindowFocus: false, });
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

                  <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                    <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                      <div className="w-full">
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 flex items-center">
                            <label htmlFor="Search Type" className="sr-only">
                              Search Type
                            </label>
                            <select
                              value={searchType}
                              id="searchType"
                              name="searchType"
                              autoComplete="searchType"
                              className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-6 text-gray-500 sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                              onChange={(e) => setSearchType(e.target.value as SearchType)}
                            >
                              <option disabled value="rent">Rent</option>
                              <option value="sale">Buy</option>
                            </select>
                          </div>
                          <input
                            id="search"
                            name="search"
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-16 pr-3 text-sm placeholder-gray-500 focus:border-purple-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
                            placeholder="City, neighborhood or address"
                            ref={searchInput}
                          />
                          <div onClick={() => setSearchText(searchInput?.current?.value ?? "")} className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-purple-600 p-2 text-indigo-400 hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
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
                          <Menu.Button className="flex rounded-full bg-purple-300 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
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

        {/* 3 column wrapper */}
        <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
          {/* Left sidebar & main wrapper */}
          <div className="min-w-0 flex-1 bg-white xl:flex" >
            <div className="border-b border-gray-200 bg-white xl:w-64 xl:flex-shrink-0 xl:border-b-0 xl:border-r xl:border-gray-200">
              <FilterForm onSubmit={(values) => {
                setFilters(values)
              }} />
            </div>

            <div className="bg-white lg:min-w-0 lg:flex-1 h-screen overflow-scroll">
              {isFetching ? <Loading />
                : <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                  {/* Start main area*/}
                  <div className="relative h-full" style={{ minHeight: '36rem' }}>
                    <h2 className="text-3xl tracking-wide font-extralight text-gray-600">Available for {searchType === "rent" ? "Rent" : "Sale"} in <span className="font-semibold">{data?.location?.city}, {data?.location?.state_code}</span></h2>
                    <div className="flex flex-row justify-between">
                      <p className="mt-2 text-sm text-gray-500"><span className="text-purple-500 font-semibold">{data?.listings.meta.matching_rows?.toLocaleString('en-US')}</span> units avaliable</p>
                      <p className="mt-2 text-sm text-gray-500">Sort by: <span className="text-purple-500 font-semibold">Relevance</span></p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      {data?.listings?.properties?.map(property => {
                        return (
                          <Link key={property.property_id} href={`/room/${router.query.id}/property/${property.property_id}`}>
                            <div className="border h-72 border-gray-300 rounded-lg relative flex flex-col overflow-hidden hover:border-purple-500 cursor-pointer">
                              <div style={{ backgroundImage: `url('${property.thumbnail}')` }} className="h-full bg-no-repeat bg-cover">
                              </div>
                              <div className="h-full pt-3 px-5 flex flex-col justify-between">
                                <div className="flex flex-row justify-between">
                                  <p>
                                    <span className="text-purple-600 font-semibold text-lg">${property.price.toLocaleString("en-US")}</span>
                                    <span className="text-gray-400 text-xs pl-1 align-middle">{formatDistanceStrict(new Date(property.last_update), new Date(), { addSuffix: true })}</span>
                                  </p>
                                  <div className="w-6 h-6 pt-1"><HeartIcon /></div>
                                </div>

                                <div className="pt-2">
                                  <p>{property.address.neighborhood_name}</p>
                                  <p className="text-sm text-gray-500">{property.address.line}, {property.address.city}, {property.address.state_code}</p>
                                </div>

                                <div className="pt-3 pb-3 flex flex-row justify-between">
                                  <div className="flex flex-row h-4 text-xs">
                                    <div className="h-5 w-5 mr-2"><Bed /></div> {property.beds} bd.</div>
                                  <div className="flex flex-row h-4 text-xs">
                                    <div className="h-5 w-5 mr-2"><Bath /></div> {property.baths} ba.</div>
                                  <div className="flex flex-row h-4 text-xs">
                                    <div className="h-5 w-5 mr-2"><Size /></div> {property.building_size?.size} {property.building_size?.units}</div>
                                </div>
                              </div>
                            </div>
                          </Link>)
                      })}

                    </div>
                  </div>
                  {/* End main area */}
                </div>}
            </div>
          </div >

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
      </div>
    </>
  )
}

export default Room

const Bed = () => {
  return (<svg version="1.1" className="stroke-purple-500 fill-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 315 315" enableBackground="new 0 0 315 315">
    <path d="m292.617,146.484h-3.105v-51.322c0-17.997-14.642-32.639-32.638-32.639h-198.748c-17.996,0-32.638,14.642-32.638,32.639v51.322h-3.106c-12.341,0-22.382,10.041-22.382,22.383v33.162c0,12.342 10.041,22.383 22.383,22.383h27.672v21.064c0,3.866 3.134,7 7,7s7-3.134 7-7v-21.064h186.891v21.064c0,3.866 3.134,7 7,7 3.866,0 7-3.134 7-7v-21.064h27.672c12.342,0 22.383-10.041 22.383-22.383v-33.162c-0.001-12.342-10.042-22.383-22.384-22.383zm-253.129-51.322c0-10.277 8.36-18.639 18.638-18.639h198.748c10.277,0 18.638,8.361 18.638,18.639v51.322h-8.974v-14.057c0-8.964-7.292-16.256-16.255-16.256h-71.754c-8.965,0-16.258,7.292-16.258,16.256v14.057h-9.543v-14.057c0-8.964-7.293-16.256-16.258-16.256h-71.753c-8.963,0-16.255,7.292-16.255,16.256v14.057h-8.974v-51.322zm136.783,51.322v-14.057c0-1.223 1.034-2.256 2.258-2.256h71.754c1.223,0 2.255,1.033 2.255,2.256v14.057h-76.267zm-113.809,0v-14.057c0-1.223 1.032-2.256 2.255-2.256h71.754c1.224,0 2.258,1.033 2.258,2.256v14.057h-76.267zm238.538,55.545c0,4.622-3.761,8.383-8.383,8.383h-270.234c-4.622,0-8.383-3.761-8.383-8.383v-33.162c0-4.622 3.761-8.383 8.383-8.383h270.234c4.622,0 8.383,3.761 8.383,8.383v33.162z" />
  </svg>
  )
}

const Bath = () => {
  return <svg version="1.1" className="stroke-purple-500 fill-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 315 315" enableBackground="new 0 0 315 315">
    <path d="m315,153.755c0-13.876-11.288-25.165-25.164-25.165h-238.527v-70.175c0-7.03 5.719-12.749 12.749-12.749s12.749,5.719 12.749,12.749c0,3.866 3.134,7 7,7 3.866,0 7-3.134 7-7 0-14.749-12-26.749-26.749-26.749s-26.749,12-26.749,26.749v70.176h-12.145c-13.876-0.001-25.164,11.288-25.164,25.164 0,11.448 7.688,21.129 18.173,24.166 0.064,20.84 0.8,41.789 9.207,57.286 6.592,12.151 17.102,20.121 32.288,24.267l-7.235,13.565c-1.819,3.411-0.528,7.651 2.883,9.471 1.049,0.56 2.176,0.824 3.288,0.824 2.502,0 4.923-1.345 6.183-3.707l9.333-17.5c4.749,0.515 9.833,0.775 15.281,0.775h136.199c5.449,0 10.532-0.261 15.281-0.775l9.333,17.5c1.26,2.362 3.681,3.707 6.183,3.707 1.111,0 2.239-0.265 3.288-0.824 3.411-1.819 4.702-6.059 2.883-9.471l-7.234-13.565c15.185-4.146 25.695-12.115 32.287-24.267 8.407-15.497 9.143-36.446 9.207-57.286 10.483-3.037 18.172-12.717 18.172-24.166zm-89.4,95.148h-136.2c-52.108,0-56.88-23.965-57.214-69.985h250.627c-0.334,46.02-5.105,69.985-57.213,69.985zm64.236-83.986h-264.672c-6.156,0-11.164-5.007-11.164-11.162 0-6.156 5.008-11.165 11.164-11.165h264.672c6.156,0 11.164,5.009 11.164,11.165 0,6.156-5.008,11.162-11.164,11.162z" />
  </svg>
}

const Size = () => {
  return (<svg className="stroke-purple-500 fill-purple-500" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    viewBox="0 0 100 100" xmlSpace="preserve">
    <g id="turf-size">
      <path d="M76.647,30.353c-1.104,0-2-0.896-2-2v-3h-3c-1.104,0-2-0.896-2-2s0.896-2,2-2h5c1.104,0,2,0.896,2,2v5
   C78.647,29.457,77.752,30.353,76.647,30.353z"/>
      <path d="M62.988,25.353h-8.659c-1.104,0-2-0.896-2-2s0.896-2,2-2h8.659c1.104,0,2,0.896,2,2S64.093,25.353,62.988,25.353z" />
      <path d="M45.67,25.353h-8.659c-1.104,0-2-0.896-2-2s0.896-2,2-2h8.659c1.104,0,2,0.896,2,2S46.775,25.353,45.67,25.353z" />
      <path d="M23.353,30.353c-1.104,0-2-0.896-2-2v-5c0-1.104,0.896-2,2-2h5c1.104,0,2,0.896,2,2s-0.896,2-2,2h-3v3
   C25.353,29.457,24.457,30.353,23.353,30.353z"/>
      <path d="M23.353,64.988c-1.104,0-2-0.896-2-2v-8.659c0-1.104,0.896-2,2-2s2,0.896,2,2v8.659
   C25.353,64.093,24.457,64.988,23.353,64.988z"/>
      <path d="M23.353,47.67c-1.104,0-2-0.896-2-2v-8.659c0-1.104,0.896-2,2-2s2,0.896,2,2v8.659
   C25.353,46.775,24.457,47.67,23.353,47.67z"/>
      <path d="M28.353,78.647h-5c-1.104,0-2-0.896-2-2v-5c0-1.104,0.896-2,2-2s2,0.896,2,2v3h3c1.104,0,2,0.896,2,2
   S29.457,78.647,28.353,78.647z"/>
      <path d="M62.988,78.647h-8.659c-1.104,0-2-0.896-2-2s0.896-2,2-2h8.659c1.104,0,2,0.896,2,2S64.093,78.647,62.988,78.647z" />
      <path d="M45.67,78.647h-8.659c-1.104,0-2-0.896-2-2s0.896-2,2-2h8.659c1.104,0,2,0.896,2,2S46.775,78.647,45.67,78.647z" />
      <path d="M76.647,78.647h-5c-1.104,0-2-0.896-2-2s0.896-2,2-2h3v-3c0-1.104,0.896-2,2-2s2,0.896,2,2v5
   C78.647,77.752,77.752,78.647,76.647,78.647z"/>
      <path d="M76.647,64.988c-1.104,0-2-0.896-2-2v-8.659c0-1.104,0.896-2,2-2s2,0.896,2,2v8.659
   C78.647,64.093,77.752,64.988,76.647,64.988z"/>
      <path d="M76.647,47.67c-1.104,0-2-0.896-2-2v-8.659c0-1.104,0.896-2,2-2s2,0.896,2,2v8.659
   C78.647,46.775,77.752,47.67,76.647,47.67z"/>
      <path d="M90.216,92.216H9.784c-1.104,0-2-0.896-2-2V9.784c0-1.104,0.896-2,2-2h80.432c1.104,0,2,0.896,2,2v80.432
   C92.216,91.32,91.32,92.216,90.216,92.216z M11.784,88.216h76.432V11.784H11.784V88.216z"/>
    </g>
    <g id="Layer_1">
    </g>
  </svg>)
}


const FilterForm = ({ onSubmit }: { onSubmit: (values: FilterValues) => void }) => {
  const { register, handleSubmit, control } = useForm()

  return (<div className="h-full py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
    <div className="relative h-full" style={{ minHeight: '12rem' }}>
      <fieldset className="space-y-2">
        <h4 className="mb-2 font-semibold">Category</h4>
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="condo"
              value="condo"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              {...register('prop_type')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="condo" className="font-medium text-gray-700">
              Apartments
            </label>
          </div>
        </div>
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="single_family"
              value="single_family"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              {...register('prop_type')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="single_family" className="font-medium text-gray-700">
              Houses
            </label>
          </div>
        </div>
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="townhouses"
              value="townhouse"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              disabled
              {...register('prop_sub_type')}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="townhouses" className="font-medium text-gray-700">
              Townhouses
            </label>
          </div>
        </div>
      </fieldset>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>


      <fieldset className="mt-10">
        <h4 className="mb-2 font-semibold">Price Range</h4>
        <div className="flex flex-row space-x-4">
          <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600">
            <label htmlFor="price_min" className="block text-xs font-medium text-gray-900">
              Min
            </label>
            <input
              step="1000"
              min="0"
              type="number"
              {...register("price_min")}
              id="price_min"
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder="0"
            />
          </div>

          <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-purple-600 focus-within:ring-1 focus-within:ring-purple-600">
            <label htmlFor="price_max" className="block text-xs font-medium text-gray-900">
              Max
            </label>
            <input
              step="1000"
              min="0"
              type="number"
              id="price_max"
              {...register("price_max")}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder="300000"
            />
          </div>
        </div>
      </fieldset>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>

      <fieldset className="mt-10 space-y-6">
        <h4 className="mb-2 font-semibold">Rooms</h4>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Bedroom</h2>
          </div>
          <Controller
            name="bedrooms"
            control={control}
            render={({ field }) =>
              <RadioGroup value={field.value} onChange={field.onChange} className="mt-2">
                <RadioGroup.Label className="sr-only"> Choose Your Bedroom</RadioGroup.Label>
                <div className="grid gap-2 grid-cols-5">
                  {roomOptions.map((option) => (
                    <RadioGroup.Option
                      key={option}
                      value={option}
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-offset-2 ring-purple-500' : '',
                          checked
                            ? 'bg-purple-600 border-transparent text-white hover:bg-purple-700'
                            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                          'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer'
                        )
                      }
                    >
                      <RadioGroup.Label as="span">{option}</RadioGroup.Label>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            }
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Bathroom</h2>
          </div>
          <Controller
            name="bathrooms"
            control={control}
            render={({ field }) =>
              <RadioGroup value={field.value} onChange={field.onChange} className="mt-2">
                <RadioGroup.Label className="sr-only"> Choose Your Bathroom</RadioGroup.Label>
                <div className="grid gap-2 grid-cols-5">
                  {roomOptions.map((option) => (
                    <RadioGroup.Option
                      key={option}
                      value={option}
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-offset-2 ring-purple-500' : '',
                          checked
                            ? 'bg-purple-600 border-transparent text-white hover:bg-purple-700'
                            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                          'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer'
                        )
                      }
                    >
                      <RadioGroup.Label as="span">{option}</RadioGroup.Label>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            } />
        </div>
      </fieldset>
      <button
        onClick={handleSubmit(onSubmit)}
        className="mt-10 inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >Apply filter</button>
    </div>
  </div>)

}


const Loading = () => {
  return <div role="status" className="flex justify-center pt-10">
    <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
}