'use client'
import SignForm from "@/components/signForm";
import { Login } from "./library/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";


export default function Home() {
  const cookie = Cookies.get("user_identifier");
  const router = useRouter();
  // console.log(cookie);
  
  useEffect(() => {
    if (cookie) {
      router.push("/auth/chat")
    }
  }, [cookie, router])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (Object.fromEntries(formData).email === "" || Object.fromEntries(formData).password === "") {
      return
    }

    Login(Object.fromEntries(formData)).then((res) => {
      // console.log(res);
      if (res.status === 200) {
        localStorage.setItem("user", res.user);
        router.push("/auth/chat")
      } else {
        throw new Error("Failed to login" + res.status)
      }
    })
  }

  return (
    <SignForm text="Doesn&apos;t have an account?" url="/create" textUrl="Create" buttonText="Login" handleEvent={handleSubmit} eventdisabled={true} identifiertext="Email or Username" type="text"/>
  );
}
