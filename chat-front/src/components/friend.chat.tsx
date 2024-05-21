'use client'

import { GetFriendsAll } from "@/app/library/api"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Skeleton } from "@nextui-org/react"
import { UnreadChat } from "./smallcomponent.chat"

interface FriendListProps {
    id: string
}

type Friend = {
    picture: string;
    username: string;
};
export default function FriendList(props: FriendListProps) {
    const [friends, setFriends] = useState<any>([])
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const getFriends = async () => {
            await GetFriendsAll().then(async (res) => {
                await setFriends(res.friends);
                await setLoading(false);
            });
        }

        getFriends();
        // console.log(friends);
    }, []);
    // console.log(friends);
    return (
        <div id={props.id}>
            {loading ? (
                <button 
                 className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                    <div 
                        className="object-cover w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse">
                    </div>
                    <div className="text-left rtl:text-right ms-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    </div>
                </button>
            ): (
                friends && friends.length > 0 ? (
                    friends.map((friend : any, index : number) => (
                        <button
                            className="flex items-center justify-between w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none border border-gray-200 rounded-md"
                            key={index}>
                            <div className="items-center flex">
                                <Image
                                    width={40}
                                    height={40}
                                    className="object-cover w-8 h-8 rounded-full"
                                    src={`http://localhost:8080/assets/image/profile/${friend.Picture || "default.png"}`}
                                    alt=""
                                />
                                <div className="text-left rtl:text-right ms-4">
                                    <h1 className="text-md font-medium text-gray-700 capitalize dark:text-white px-4">{friend.Username}</h1>
                                </div>
                                <span className="inline-flex items-center justify-center w-5 h-5 text-sm font-semibold text-white rounded-full ms-12">
                                    <span className="flex items-center justify-center w-full h-full"></span>
                                </span>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="flex items-center justify-between w-full px-0 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                        <div className="text-md font-medium text-gray-700 capitalize dark:text-white px-5 py-2 ms-4">No friends found</div>
                        <span className="inline-flex items-center justify-center w-5 h-5 text-sm font-semibold text-white rounded-full ms-12">
                                        <span className="flex items-center justify-center w-full h-full"></span>
                        </span>
                    </div>
                )
            )}
        </div>
    )
}