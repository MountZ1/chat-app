import React from "react";

interface SignFormProps {
    text: string;
    url: string;
    textUrl: string;
    buttonText: string;
    handleEvent: (event: React.FormEvent<HTMLFormElement>) => void;
    children?: React.ReactNode;
    eventdisabled?: boolean;
    identifiertext: string;
    type: string;
}
const signForm: React.FC<SignFormProps> = (props) => {  
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-80 border border-[#072ac8] rounded-lg shadow-2xl">
          <h1 className="text-2xl font-bold text-center mt-2">MountChat</h1>
  
          <div className="pt-8 px-4">
            <form encType="multipart/form-data" className="space-y-4" onSubmit={props.handleEvent}>
              {props.children}
              <div className="relative">
                <input type={props.type} id="email" name="email" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#1e96fc] focus:outline-none focus:ring-0 focus:border-[#1e96fc] peer" placeholder=" "/>
                <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{props.identifiertext}</label>
              </div>
              <div className="relative">
                <input type="password" id="floating_outlined" name="password" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#1e96fc] focus:outline-none focus:ring-0 focus:border-[#1e96fc] peer" placeholder=" " />
                <label htmlFor="floating_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Password</label>
              </div>
              <div className="">
                <button 
                type="submit" 
                className={`text-white bg-[#ffc600] hover:bg-[#d3a400] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full disabled:bg-[#ffe792]`}
                {...!props.eventdisabled ? {disabled: true} : null}>{props.buttonText}</button>
              </div>
            </form>
            <p className="p-2">
                {props.text}
                <a href={props.url} className="text-[#1e96fc] hover:text-[#036ac2]"> {props.textUrl}</a>
            </p>
          </div>
        </div>
      </main>
    )
}

export default signForm;