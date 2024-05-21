'use client'
import { CheckIcon, CrossIcon } from "@/components/icon";
import SignForm from "@/components/signForm";
import { useEffect, useState } from "react";
import { CheckUsername, CreateAccount } from "../library/api";

export default function Create() {
    const [username, setUsername] = useState("")
    const [available, setAvailable] = useState(false)
    const checkUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setUsername(event.target.value)
    }
    useEffect(() => {
        if (username !== "" && username.length >= 5) {
            const check = CheckUsername(username);
            check.then((data) => {
                // console.log(data);
                setAvailable(data.available)
            })
        } else{
            setAvailable(false)
        }
    }, [username])

    const handleSubmit =  (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // console.log(Object.fromEntries(formData))
        if (Object.fromEntries(formData).email === "" || Object.fromEntries(formData).password === "") {
            return
        }
        CreateAccount(Object.fromEntries(formData)).then(res => {
            // console.log(res.status === );
            if (res.status === 200) {
                window.location.href = "/"
            } else {
                throw new Error("Failed to create account" + res.status)
            }
        })
    }
    return (
        <SignForm text="Already have an account?" url="/" textUrl="Login" buttonText="Create" handleEvent={handleSubmit} eventdisabled={available} identifiertext="Email" type="email">
            <div className="relative">
                <input type="text" id="username" name="username" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#1e96fc] focus:outline-none focus:ring-0 focus:border-[#1e96fc] peer" placeholder=" " onChange={(e) => checkUsername(e)}/>
                <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Username</label>
            </div>
            {username && available ? (
                <p className="text-[#1d9a47] text-sm flex items-center ms-2">
                    <CheckIcon />
                    <span className="ml-1">Username available</span>
                </p>
            ) : null}

            {username && !available ? (
                <p className="text-[#dc3545] text-sm flex items-center">
                    <CrossIcon />
                    <span className="ml-1">{username.length < 5 ? "Username must be at least 5 characters" : "Username Already Exist"}</span>
                </p>
            ) : null}

        </SignForm>
    )
}