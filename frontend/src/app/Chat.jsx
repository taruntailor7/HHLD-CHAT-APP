"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Listen for incoming msgs
    newSocket.on("chat msg", (msgrecv) => {
      console.log("received msg on client " + msgrecv);
      setMsgs((prevMsgs) => [
        ...prevMsgs,
        { text: msgrecv, sentByCurrUser: false },
      ]);
    });

    // Clean up function
    return () => newSocket.close();
  }, []);

  const sendMsg = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("chat msg", msg);
      setMsgs((prevMsgs) => [...prevMsgs, { text: msg, sentByCurrUser: true }]);
      setMsg("");
    }
  };

  return (
    <div>
      <div className="msgs-container">
        {msgs.map((msg, index) => (
          <div
            key={index}
            className={` m-3 ${
              msg.sentByCurrUser ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`${
                msg.sentByCurrUser ? "bg-blue-200" : "bg-green-200"
              } p-3 rounded-lg text-black`}
            >
              {msg.text}
            </span>
          </div>
        ))} 
      </div>
      <form onSubmit={sendMsg} className="max-w-md mx-auto my-10">
        <div className="relative">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your text here"
            required
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
