import Image from "next/image"
import Header from "./header.chat"
import FriendList from "./friend.chat"
import ChatList from "./chat.chat"
import ChatPage from "./main.chat"
import { useState } from "react"
export default function SecondSidebar({activeTabs} : any) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userPicture, setUserPicture] = useState<string | null>(null);
    return (
        <>
            <div className="w-full h-screen overflow-hidden">
                <Header />
                <div className="flex">
                    <div className="border h-screen border-gray-200 dark:border-gray-700 rounded-md flex-col w-[20%]">
                        <h2 className="px-5 mt-2 text-lg font-medium text-gray-800 dark:text-white">{activeTabs}</h2>
                        <div className="mt-4 space-y-4">
                            {activeTabs === "Chat" && <ChatList id="chat" setSelectedId={setSelectedId} selectedId={selectedId} setUsername={setUsername} setUserPicture={setUserPicture}/>}
                            {activeTabs === "Friend" && <FriendList id="friend" />}
                        </div>
                    </div>
                    <div className="w-[80%]">
                        {selectedId ? <ChatPage id={selectedId} username={username} picture={userPicture} /> : ""}
                        {/* <ChatPage id={selectedId || ""}/> */}
                    </div>
                </div>
            </div>
        </>
    )
}