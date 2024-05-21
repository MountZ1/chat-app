'use client'
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { CheckCreditentials } from "../library/api";
import { useEffect } from "react";

export default function Auth() {
    const router = useRouter();
    const cookie = Cookies.get("user_identifier");
    
    useEffect(() => {
        // if (cookie){
        //     CheckCreditentials(cookie).then((res) => {
        //         if (res.valid){
        //             router.push("/auth/chat")
        //         }else{
        //             Cookies.remove("user_identifier");
        //             router.push("/");
        //         }
        //     })
        // } else{
        //     router.push("/");
        // }
    })
}