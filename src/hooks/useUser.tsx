import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

function useUser() {
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn()
        }
    }, [status])

    return { status, session, user: session?.user }
}

export default useUser