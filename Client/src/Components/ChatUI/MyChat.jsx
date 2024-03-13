import {
  setUser,
  setSelectedChat,
  setNotification,
  setChats,
} from "../../features/chat/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ChatLoading from "./ChatLoading";
const MyChat = ({ fetchAgain }) => {
  const dispatch = useDispatch();
  const [loggedUser, setLoggedUser] = useState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      dispatch(setChats(data));
    } catch (error) {
      toast("Failed To Load Chats", {
        autoClose: 4500,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return <></>;
};

export default MyChat;
