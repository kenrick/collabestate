import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import FeedLayout from "../../../../components/FeedLayout";
import Loading from "../../../../components/Loading";

const PropertyPage: NextPage = () => {
  const router = useRouter()
  const { data, isFetching } = trpc.useQuery(["listing.byId", {
    propertyId: router.query.pid as string
  }], { refetchOnWindowFocus: false, });

  return (
    <FeedLayout>
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
    </FeedLayout>
  )
}
export default PropertyPage