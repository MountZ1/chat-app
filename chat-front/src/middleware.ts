// import { getAuth, authentication } from "./app/library/auth";
'use client'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";
import { CheckCreditentials } from "./app/library/api";
import next from "next";


const protectedRoutes = [
    "/auth/chat"
]
// const validation = async(cookies : string) => {
//     const res = await CheckCreditentials(cookies)
//     console.log(res.valid)
//     return await res.valid
// }
export async function middleware(req: NextRequest){
    const allcookie = req.headers.get('cookie');
    const cookie = allcookie?.split(';').find(c => c.trim().startsWith('user_identifier='));
    
    if (!cookie && protectedRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', req.url));
    }else if (cookie && protectedRoutes.includes(req.nextUrl.pathname)) {
        const response = await fetch(`http://localhost:8080/api/accounts/credentials`, {
        method: "POST",
        headers: {
            'cookie': cookie
        },
        credentials: "include",
        });
        // response ? console.log("request made") : console.log("no request made");
        const res = await response.json();
        if (!res.valid) {
            Cookies.remove('user_identifier');
            return NextResponse.redirect(new URL('/', req.url));
        } else {
            return NextResponse.next();
        }
    }
}

// export const config ={
//     matcher : [
//         "/auth/chat"
//     ]
// }