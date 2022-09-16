import { useRouter } from "next/router"
import { FC } from "react"
import useUser from "../hooks/useUser"
import Layout, { LayoutProps } from "./Layout"
import Realtime, { RealtimeWrapper } from "./Realtime"


const FeedLayout: FC<LayoutProps> = ({ children, ...props }) => {
  const { user } = useUser();
  const router = useRouter()

  return <Layout {...props} >
    <RealtimeWrapper email={user?.email as string} roomId={router.query.id as string}>
      <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
        {children}
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
  </Layout >
}

export default FeedLayout