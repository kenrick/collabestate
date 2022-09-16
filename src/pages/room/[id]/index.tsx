import type { NextPage } from "next";
import { FC, useRef, useState } from 'react'
import { MagnifyingGlassIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import useUser from "../../../hooks/useUser";
import { trpc } from "../../../utils/trpc";
import { formatDistanceStrict } from "date-fns";
import { RadioGroup } from '@headlessui/react'
import classNames from "classnames";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { FeedMessage } from "../../../components/Realtime";
import { useChannel } from "@ably-labs/react-hooks";
import Loading from "../../../components/Loading";
import { BedIcon, BathIcon, SizeIcon } from "../../../components/Icons";
import FeedLayout from "../../../components/FeedLayout";

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
    <FeedLayout extra={
      <SearchInput
        onSubmit={(input, type) => {
          setSearchType(type as SearchType)
          setSearchText(input)
        }}
      />
    }>
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
                      <div key={property.property_id} className="relative">
                        <ShareToChat
                          image={property.thumbnail as string}
                          price={property.price}
                          address={property.address.line}
                          email={user?.email as string}
                          propertyId={property.property_id}
                          roomId={router.query.id as string} />

                        <Link href={`/room/${router.query.id}/property/${property.property_id}`}>
                          <div className="border h-72 border-gray-300 rounded-lg relative flex flex-col overflow-hidden hover:border-purple-500 cursor-pointer">
                            <div style={{ backgroundImage: `url('${property.thumbnail}')` }} className="h-full bg-no-repeat bg-cover">
                            </div>
                            <div className="h-full pt-3 px-5 flex flex-col justify-between">
                              <div className="flex flex-row justify-between">
                                <p>
                                  <span className="text-purple-600 font-semibold text-lg">${property.price.toLocaleString("en-US")}</span>
                                  <span className="text-gray-400 text-xs pl-1 align-middle">{formatDistanceStrict(new Date(property.last_update), new Date(), { addSuffix: true })}</span>
                                </p>

                              </div>

                              <div className="pt-2">
                                <p>{property.address.neighborhood_name}</p>
                                <p className="text-sm text-gray-500">{property.address.line}, {property.address.city}, {property.address.state_code}</p>
                              </div>

                              <div className="pt-3 pb-3 flex flex-row justify-between">
                                <div className="flex flex-row h-4 text-xs">
                                  <div className="h-5 w-5 mr-2"><BedIcon /></div> {property.beds} bd.</div>
                                <div className="flex flex-row h-4 text-xs">
                                  <div className="h-5 w-5 mr-2"><BathIcon /></div> {property.baths} ba.</div>
                                <div className="flex flex-row h-4 text-xs">
                                  <div className="h-5 w-5 mr-2"><SizeIcon /></div> {property.building_size?.size} {property.building_size?.units}</div>
                              </div>
                            </div>
                          </div>
                        </Link> </div>)
                  })}

                </div>
              </div>
              {/* End main area */}
            </div>}
        </div>
      </div >
    </FeedLayout>
  )
}

export default Room

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



const ShareToChat = ({ propertyId, roomId, email, address, image, price }: { propertyId: string, roomId: string, email: string, address: string, image: string, price: number }) => {
  const [feedChannel] = useChannel(`${roomId}:activity`, (message) => { message; })

  const data: FeedMessage = {
    from: email,
    payload: {
      price,
      type: 'share',
      propertyId,
      address,
      image
    }
  }


  return <div onClick={() => {
    feedChannel.publish({ data })
  }} className="w-6 h-6 pt-2 z-10 absolute right-4  cursor-pointer top-1/2"><ChatBubbleBottomCenterIcon className="hover:text-purple-500" /></div>
}

const SearchInput: FC<{ onSubmit: (input: string, type: string) => void }> = ({ onSubmit }) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTypeRef = useRef<HTMLSelectElement>(null)

  return (
    <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
      <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
        <div className="w-full">
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center">
              <label htmlFor="Search Type" className="sr-only">
                Search Type
              </label>
              <select
                ref={searchTypeRef}
                id="searchType"
                name="searchType"
                autoComplete="searchType"
                className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-6 text-gray-500 sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
              ref={searchInputRef}
            />
            <div onClick={() => onSubmit(searchTypeRef?.current?.value ?? "", searchTypeRef.current?.value ?? "")} className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}