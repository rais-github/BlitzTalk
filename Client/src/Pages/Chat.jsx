import { useEffect, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/chats");
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default Chat;
