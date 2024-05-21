'use client'
import { useState } from "react";
import { useEffect } from "react";
import { ChatIcon, LogOut, People } from "@/components/icon";
import SecondSidebar from "@/components/secondSIdebar.chat";

export default function Chat() {
    const [activeTabs, setActiveTabs] = useState("Chat");
    const active = "p-1.5 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800 transition-transform duration-300 ease-in-out";
    const inActive = "p-1.5 text-gray-500 focus:outline-nones rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100";
    const transition = "transition-transform duration-300 ease-in-out";
    return(
        <div className="fixed w-full">
            <aside className="flex" id="default-sidebar">
                <div className="flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700 border-l border-r rounded-lg">

                    <div className="mt-12">
                        <div className="flex flex-col items-center space-y-12">
                            <a 
                                onClick={() => setActiveTabs("Chat")}
                                className={`${activeTabs === "Chat" ? active : inActive} ${activeTabs === "Chat" ? transition : ""}`}>
                                <ChatIcon/>
                            </a>
                            <a 
                                onClick={() => setActiveTabs("Friend")}
                                className={`${activeTabs === "Friend" ? active : inActive} ${activeTabs === "Friend" ? transition : ""}`}>
                                <People />
                            </a>
                        </div>
                    </div>
                </div>

                <SecondSidebar activeTabs={activeTabs}/>
            </aside>
        </div>
    )
}