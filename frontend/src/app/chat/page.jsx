"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuthStore } from "../zustand/useAuthStore";
import axios from "axios";
import { useUsersStore } from "../zustand/useUsersStore";
import ChatUsers from "../_components/chatUsers";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import { chatMsgs, useChatMsgsStore } from "../zustand/useChatMsgsStore";

const Chat = () => {
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);
  // const [msgs, setMsgs] = useState([]);
  const { authName } = useAuthStore();
  const { updateUsers } = useUsersStore();
  const chatReceiver = useChatReceiverStore((state) => (state.chatReceiver));
  const { chatMsgs, updateChatMsgs } = useChatMsgsStore();


  const getUserData = async () => {
    const res = await axios.get("http://localhost:8000/users", {
      withCredentials: true,
    });
    console.log(res.data);
    updateUsers(res.data);
  };

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = io("http://localhost:5000", {
      query: {
        username: authName,
      },
    });
    setSocket(newSocket);

    // Listen for incoming msgs
    newSocket.on("chat msg", (msgrecv) => {
      console.log("received msg on client " + msgrecv);
      updateChatMsgs([...chatMsgs, msgrecv]);
      // setMsgs((prevMsgs) => [
      //   ...prevMsgs,
      //   { ...msgrecv, sentByCurrUser: false },
      // ]);
    });

    getUserData();

    // Clean up function
    return () => newSocket.close();
  }, []);

  const sendMsg = (e) => {
    e.preventDefault();
    const msgToBeSent = {
      text: msg,
      sender: authName,
      receiver: chatReceiver,
    };

    if (socket) {
      socket.emit("chat msg", msgToBeSent);
      // setMsgs((prevMsgs) => [...prevMsgs, { ...msgToBeSent, sentByCurrUser: true }]);
      updateChatMsgs([...chatMsgs, msgToBeSent]);
      setMsg("");
    }
  };

  return (
    <div className="h-screen flex divide-x-4">
      {/* Sidebar for Users */}
      <div className="w-1/5 border-r p-4">
        <ChatUsers />
      </div>

      {/* Chat Area */}
      <div className="w-4/5 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-gray-100">
          <h1 className="text-lg text-black font-semibold">
            {authName} is chatting with {chatReceiver}
          </h1>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4">
          {chatMsgs?.map((msg, index) => (
            <div
              key={index}
              className={`m-3 p-1 ${
                msg.sender === authName ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-2xl text-black ${
                  msg.sender === authName ? "bg-blue-200" : "bg-green-200"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t flex items-center justify-center bg-gray-100">
          <form onSubmit={sendMsg} className="w-1/2">
            <div className="relative">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your message..."
                required
                className="block w-full p-4 pr-14 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
