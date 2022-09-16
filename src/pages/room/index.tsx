import type { NextPage } from "next";
import { CalendarIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/20/solid";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import Avatar from "../../components/Avatar";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { Membership, Room, User } from "@prisma/client";
import { FC } from "react";

type RoomWithMemberships = Room & {
  memberships: (Membership & {
    user: User;
  })[];
}

const Rooms: NextPage = () => {
  const { data: rooms, isFetching } = trpc.useQuery(["room.getAll"])
  const isRoomEmpty = (rooms ?? []).length === 0

  if (isFetching) {
    return (
      <Layout splitBackground={false}>
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout splitBackground={false}>
      {isRoomEmpty ?
        <NoRooms /> :
        <div className="w-6/12 mx-auto mt-10">
          <div className="my-5">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Rooms</h2>
          </div>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {rooms?.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </ul>
          </div>
        </div>}
    </Layout>)
}

export default Rooms


const NoRooms = () => {
  const router = useRouter()
  const { mutate: createRoom } = trpc.useMutation(["room.create"], {
    onSuccess: (room) => {
      router.push(`/room/${room.id}`)
    }
  })

  return (<div className="flex h-screen">
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
          onClick={() => createRoom()}
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Room
        </button>
      </div>
    </div>
  </div>)
}

const RoomCard: FC<{ room: RoomWithMemberships }> = ({ room }) => {
  return (
    <li>
      <a href={`/room/${room.id}`} className="block hover:bg-gray-50">
        <div className="flex items-center px-4 py-4 sm:px-6">
          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="truncate">
              <div className="flex text-sm">
                <p className="truncate font-medium text-purple-600">{room.name}</p>
              </div>
              <div className="mt-2 flex">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <p>
                    Created on <time dateTime={room.createdAt.toISOString()}>{room.createdAt.toLocaleDateString()}</time>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
              <div className="flex -space-x-1 overflow-hidden">
                {room.memberships.map((membership) => (
                  <Avatar key={membership.id}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                    email={membership.user.email}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0">
            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </a>
    </li>
  )
}