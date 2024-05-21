import Image from "next/image"
import { useEffect, useState } from "react"
import {ActiveUser, UnreadChat} from "./smallcomponent.chat"
import { GetChatAll } from "@/app/library/api"

interface ChatListProps {
    id: string,
    setSelectedId: (id : string) => void
    selectedId: string | null
    setUsername: (username : string) => void
    setUserPicture: (userPicture : string) => void
}
export default function ChatList(props: ChatListProps) {
    // bg-gray-100 
    const [chats, setChats] = useState<any>([])
    const [loading, setLoading] = useState(true)
   useEffect(() => {
       const Chat = async () =>{
        await GetChatAll().then((res) => {
            setChats(res.chat)
            setLoading(false)
        })
       }
       Chat()
   },[])
//    console.log(chats);
    return (
        <div id={props.id}>
            {loading ? (
                <button className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none border border-gray-200 rounded-md">
                    <div className="animate-pulse">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                    
                    <div className="text-left rtl:text-right">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-300 w-20 mb-2"></div>
                        <div className="h-3 bg-gray-300 w-16"></div>
                    </div>
                    </div>
                </button>
            ):(
                chats && chats.length > 0 ? (
                    chats.map((chats: any) => (
                        <button 
                        className={`flex items-center justify-between w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none border border-gray-200 rounded-md ${chats.Id === props.selectedId ? "bg-gray-100" : ""} text-left`} 
                        key={chats.Conv_id}
                        onClick={() => {
                            // console.log(chats.Conv_id);
                            props.setSelectedId(chats.Conv_id); 
                            props.setUsername(chats.Opponent); 
                            props.setUserPicture(chats.Opponent_Picture)}}>
                            <div 
                            className="relative">
                                <Image 
                                width={40} 
                                height={40} 
                                className="object-cover w-8 h-8 rounded-full" 
                                src={`http://localhost:8080/assets/image/profile/${chats.Opponent_Picture || "default.png"}`}
                                alt=""/>
                                {chats.Opponent_online ? <ActiveUser /> : ''}
                            </div>
                        
                            <div 
                            className="text-left rtl:text-right flex-grow ms-4">
                                <h1 
                                className="text-md font-medium text-gray-700 capitalize dark:text-white">{chats.Opponent}</h1>

                                <p className="text-xs text-gray-500 dark:text-gray-400">{chats.Message}</p>

                            </div>
                        </button>
                                
                    ))
                ) : (
                    <div className="flex items-center justify-between w-full px-3 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                        <div className="text-md font-medium text-gray-700 capitalize dark:text-white px-5 py-2">No Chats found</div>
                        <span className="inline-flex items-center justify-center w-5 h-5 text-sm font-semibold text-white rounded-full ms-12">
                                    <span className="flex items-center justify-center w-full h-full"></span>
                        </span>
                    </div>
                )
            )}


            
        </div>
    )
}