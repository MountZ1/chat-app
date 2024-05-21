// 'use client'
const server = process.env.NEXT_PUBLIC_URL_BACKEND;
const CheckUsername = async (username: string) => {
    const response = await fetch(`${server}/api/accounts/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(username),
    })
    const data = await response.json();
    return data
}

const CreateAccount = async (data : object) => {
    const response = await fetch(`${server}/api/accounts/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    const res = await response.json();
    return res
}

const Login = async (data : object) => {
    const response = await fetch(`${server}/api/accounts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
    const res = await response.json();
    return res
}

const CheckCreditentials = async (session : string) => {
    const response = await fetch(`${server}/api/accounts/credentials`, {
        method: "POST",
        headers:{
            'Cookie': session,
        },
        credentials: "include",
    })
    const res = await response.json();
    return res
}

const GetFriendsAll = async () => {
    const response = await fetch(`${server}/api/friend`, {
        method: "GET",
        headers: {
            'content-type': 'application/json',
        },
        credentials: "include",
    });
    const res = await response.json();
    return res
}

const GetChatAll = async () => {
    const response = await fetch(`${server}/api/getchat`, {
        method: "GET",
        headers:{
            'content-type': 'application/json',
        },
        credentials: 'include'
    });
    const res = await response.json()
    return res
}

const HistoryChat = async (conversationId : string) => {
    // console.log(conversationId)
    const response = await fetch(`${server}/api/openchat`, {
        method: "POST",
        headers:{
            'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(conversationId)
    })
    const res = await response.json()
    return res
}

const Logout = async () => {
    const response = await fetch(`${server}/api/accounts/logout`, {
        method: "POST",
        headers:{
            'content-type': 'application/json',
        },
        credentials: 'include',
    })
    const res = await response.json()
    return res
}

export { 
    CheckUsername, 
    CreateAccount, 
    Login,
    CheckCreditentials,
    GetFriendsAll,
    GetChatAll,
    HistoryChat,
    Logout,
}