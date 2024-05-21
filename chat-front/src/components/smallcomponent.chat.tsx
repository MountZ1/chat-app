import React from 'react';

type ChatProps = {
  unread: number;
};

const UnreadChat: React.FC<ChatProps> = ({ unread }) => {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-sm font-semibold text-white bg-blue-800 rounded-full">
      <span className="flex items-center justify-center w-full h-full">{unread}</span>
    </span>
  );
};

const ActiveUser = () => {
    return (
        <span className="h-2 w-2 rounded-full bg-emerald-500 absolute right-0.5 ring-1 ring-white bottom-0"></span>
    )
}

const Seen = () => {
    return (
      <div
        className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
        Seen
      </div>
    )
}

export {
  UnreadChat,
  ActiveUser,
  Seen
}
