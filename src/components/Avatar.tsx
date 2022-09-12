import { FC } from "react"
import useGravatar from "../hooks/useGravatar"
import Image from "next/image"

const Avatar: FC<{ email: string | null | undefined, className: string }> = ({ email, className }) => {
    const avatarUrl = useGravatar(email ?? "", { defaultImage: "robohash" })

    return <Image
        width={32}
        height={32}
        className={className}
        src={avatarUrl}
        alt="Your profile picture"
    />
}

export default Avatar