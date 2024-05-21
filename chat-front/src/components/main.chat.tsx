import Image from "next/image";
import { useEffect, useState } from "react";
import { useWebSocket, WebSocketProvider } from "../app/library/websocket";
import { HistoryChat } from "@/app/library/api";

interface ChatPageProps {
  id: string;
  username: string | null;
  picture: string | null;
}

interface Message {
  Sender_type: string;
  Username: string;
  Message: string;
}

export default function ChatPage(props: ChatPageProps) {
  // console.log(props);
  const { socket, messages, sendMessage } = useWebSocket();
  const [historyChat, setHistoryChat] = useState<Message[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const myUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const getOldMessages = async () => {
      try {
        const res = await HistoryChat(props.id);
        await setHistoryChat(res.conversations);
        await setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch old messages:", error);
        setIsLoading(false);
      }
    };

    getOldMessages();
  }, [props.id]);
  // console.log(historyChat);

  useEffect(() => {
    if (!props.id || !socket || !myUser.username) return;
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log("Received new message:", newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    };
  
    return () => {
      socket.onmessage = null;
    };
  }, [props.id, socket, messages, myUser.username]);

  // console.log(chatMessages);

  const handleSendMessage = (message: string) => {
    if (!socket || !message.trim() || !myUser.username) return;

    const payload = { Sender_type: 'self', conv_id: props.id, sender: myUser.username, message };
    sendMessage(payload);

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { Sender_type: 'self', Username: myUser.username, Message: message },
    ]);
  };

  return (
    <div className="w-full">
      <header className="bg-white p-4 text-gray-700 drop-shadow-lg rounded-xl flex items-center">
        <Image 
          width={32} 
          height={32} 
          className="w-8 h-8 rounded-full" 
          src={`http://localhost:8080/assets/image/profile/${props.picture || "default.png"}`}
          alt="user photo" />
        <h1 className="text-2xl font-semibold ml-4">{props.username}</h1>
      </header>

      <div className="h-screen overflow-y-auto p-4 pb-48 bg-gray-200">
        {isLoading && <p>Loading...</p>}
        {historyChat.map((msg : any, index : number) => (
          <div
            key={index}
            className={`flex mb-4 cursor-pointer ${
              msg.Sender_type === 'self' ? 'justify-end' : ''
            }`}>
            {msg.Sender_type !== 'self' && (
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white">
              <Image
                width={44}
                height={44}
                className="object-cover w-8 h-8 rounded-full"
                src={`http://localhost:8080/assets/image/profile/${props.picture || 'default.png'}`}
                alt=""/>
            </div>
            )}
            <div className={`max-w-96 p-3 gap-3 shadow text-sm rounded-xl ${
              msg.Sender_type === 'self' ? 'bg-indigo-100 text-black me-1' : 'bg-white text-gray-700 ms-1'
            }`}>
              <p>{msg.Message}</p>
            </div>
            {msg.Sender_type === 'self' && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white">
                <Image
                  width={44}
                  height={44}
                  className="object-cover w-8 h-8 rounded-full"
                  src={`http://localhost:8080/assets/image/profile/${myUser.picture || 'default.png'}`}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
        {chatMessages.map((msg: any, index: number) => (
            <div
              key={index}
              className={`flex mb-4 cursor-pointer ${
                msg.Sender_type === 'self' ? 'justify-end' : ''
              }`}>
              {msg.Sender_type !== 'self' && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white">
                <Image
                  width={44}
                  height={44}
                  className="object-cover w-8 h-8 rounded-full"
                  src={`http://localhost:8080/assets/image/profile/${props.picture || 'default.png'}`}
                  alt=""/>
              </div>
              )}
              <div className={`max-w-96 p-3 gap-3 shadow text-sm rounded-xl ${
                msg.Sender_type === 'self' ? 'bg-indigo-100 text-black me-1' : 'bg-white text-gray-700 ms-1'
              }`}>
                <p>{msg.Message}</p>
              </div>
              {msg.Sender_type === 'self' && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white">
                  <Image
                    width={44}
                    height={44}
                    className="object-cover w-8 h-8 rounded-full"
                    src={`http://localhost:8080/assets/image/profile/${myUser.picture || 'default.png'}`}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
      </div>
      <footer className="bg-white border-t border-gray-300 p-4 fixed bottom-0 drop-shadow-lg w-[76%] right-0">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            name="message"
            className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                handleSendMessage(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
            onClick={() => {
              const message = document.querySelector('input[name="message"]') as HTMLInputElement;
              handleSendMessage(message.value);
              message.value = '';
            }}
          >
            Send
          </button>
        </div>
      </footer>

    </div>
  );
}
