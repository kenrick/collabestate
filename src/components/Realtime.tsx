import { configureAbly, useChannel, usePresence } from "@ably-labs/react-hooks";
import { FormEvent, useEffect, useRef, useState } from "react";
import { env } from "../env/client.mjs";
import Avatar from "./Avatar";
import { Transition } from '@headlessui/react'
import Link from "next/link.js";
import { useRouter } from "next/router.js";

export const RealtimeWrapper = ({ email, children }: { email: string, roomId: string, children: JSX.Element }) => {
  const sdk = useRef(null)
  useEffect(() => {
    sdk.current = configureAbly({ key: env.NEXT_PUBLIC_ABLY_API_KEY, clientId: Buffer.from(email, 'utf8').toString("base64") });
  }, [email])

  if (sdk.current !== null) {
    return children
  }

  return null

}

const RealTimeWindow = ({ email, roomId }: { email: string, roomId: string }) => {
  const [messages, setMessages] = useState<FeedMessage[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [presense] = usePresence(roomId)
  const [feedChannel] = useChannel(`${roomId}:activity`, (message) => {
    setMessages((prev) => [...prev, message.data as FeedMessage])
  })

  useEffect(() => {
    feedChannel.history(async (err, result) => {
      const items = result?.items ?? []
      setMessages(items.reverse().map(item => item.data as FeedMessage))
    });

  }, [feedChannel])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, [messages]);

  const online = new Set(presense.map(p => p.clientId))

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()

    if (!inputRef) return;

    const value = inputRef.current?.value

    if (!value || value === "") {
      return;
    }

    const message: FeedMessage = {
      from: email,
      payload: {
        type: 'text',
        text: inputRef?.current?.value
      }
    }
    feedChannel.publish({ data: message })

    inputRef.current.value = ""
  }

  return <div className="h-screen flex flex-col">
    <div className="space-x-3">
      <h3 className="py-2 text-sm text-gray-600">Online</h3>
      {Array.from(online).map(o => {
        return (
          <span key={o} className="relative inline-block">
            <Transition
              appear
              show={online.has(o)}
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >

              <Avatar className="h-10 w-10 rounded-full bg-purple-300" email={Buffer.from(o, 'base64').toString("utf8")} />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />

            </Transition>  </span>)
      })}
    </div>
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
    </div>

    <div className="justify-between flex flex-col h-[30rem] border rounded-lg bg-white shadow-lg overflow-hidden">
      <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {messages.map((message, index) => {
          return <MessageItem key={index} message={message} email={email} />
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage}>
        <div className="border-t border-gray-200 mb-2 sm:mb-0">
          <div className="relative flex">
            <input ref={inputRef} type="text" placeholder="Write your message!" className="w-full border-none focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 focus:ring-purple-600" />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button type="submit" className="inline-flex items-center justify-center px-4 py-2 transition duration-500 ease-in-out text-whit focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90 text-purple-500">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div >
}

const MessageFromMe = ({ from, children }: { from: string, children: JSX.Element }) => {
  return (<div className="chat-message">
    <div className="flex items-end">
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-purple-50 border border-purple-500 text-gray-600">{children}</span></div>
      </div>
      <Avatar email={from} className="w-6 h-6 rounded-full order-1" />
    </div>
  </div>)
}


const MessageFromOther = ({ from, children }: { from: string, children: JSX.Element }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end justify-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-purple-600 text-white ">{children}</span></div>
        </div>
        <Avatar email={from} className="w-6 h-6 rounded-full order-2" />
      </div>
    </div>
  )
}

const MessageItem = ({ message, email }: { message: FeedMessage, email: string }) => {
  const MessageWrapper = message.from === email ? MessageFromMe : MessageFromOther
  let messageView;

  switch (message.payload.type) {
    case 'text':
      messageView = <TextMessageView payload={message.payload} />
      break;
    case 'share':
      messageView = <ShareMessageView payload={message.payload} />
      break;
  }

  if (!messageView) {
    return null
  }

  return <MessageWrapper from={message.from}>
    {messageView}
  </MessageWrapper>

}

const TextMessageView = ({ payload }: { payload: TextMessage }) => {
  return <span>{payload.text}</span>
}

const ShareMessageView = ({ payload }: { payload: ShareMessage }) => {
  const router = useRouter()
  return <Link href={`/room/${router.query.id}/property/${payload.propertyId}`}>
    <div className="flex flex-row cursor-pointer space-x-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="h-8 w-8 rounded-lg border-2 border-white " src={payload.image} alt="" />
      <p className="flex flex-col">
        <span>{payload.address}</span>
        <span className="font-semibold">${payload.price.toLocaleString("en-US")}</span>
      </p>
    </div >
  </Link >

}

type TextMessage = {
  type: "text"
  text: string
}


type ShareMessage = {
  type: "share"
  propertyId: string
  image: string
  address: string
  price: number
}

export interface FeedMessage {
  from: string
  payload: TextMessage | ShareMessage
}

export default RealTimeWindow