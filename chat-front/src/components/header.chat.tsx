"use client"

import { Logout } from "@/app/library/api";
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
export default function Header(){
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [user, setUser ] = useState<any>([]);
    useEffect(() => {
        const userString = localStorage.getItem("user");
        const userj = userString ? JSON.parse(userString) : null;
        setUser(userj);
    }, [])

    const handleLogout = async () => {
        await Logout().then((res) => {
            if (res.status === 200) {
                router.push("/");
                localStorage.removeItem("user");
            }
        });
    }
    return(
        <nav className="relative z-50 top-0 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end relative">
                        <a href="#" className="flex ms-2 md:me-24">
                        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">MountChat</span>
                        </a>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3">
                            <div>
                                <button 
                                type="button" 
                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" 
                                aria-expanded={open? true : false} 
                                data-dropdown-toggle="dropdown-user" 
                                aria-controls="dropdown-user" 
                                id="dropdown-button" 
                                aria-haspopup="true" 
                                onClick={()=>setOpen(!open)}>
                                    <span className="sr-only">Open user menu</span>
                                    <Image 
                                    width={32} 
                                    height={32} 
                                    className="w-8 h-8 rounded-full" 
                                    src={`http://localhost:8080/assets/image/profile/${user.picture || "default.png"}`}
                                    alt="user photo"/>
                                </button>
                            </div>

                            { open &&(
                            <div 
                            className="absolute mt-2 right-2 w-48 bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" 
                            id="dropdown-user" 
                            role="menu"
                            style={{ top: "calc(100% + 0.5rem)" }} 
                            aria-orientation="vertical" 
                            aria-labelledby="dropdown-button">
                                <div 
                                className="px-4 py-3" 
                                role="none">
                                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                                    {user.username}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                    {user.email}
                                    </p>
                                </div>
                                <ul className="py-1" role="none">
                                    <li>
                                        <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                                    </li>
                                    <li>
                                        <a
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem" onClick={handleLogout}>Sign out</a>
                                    </li>
                                </ul>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}