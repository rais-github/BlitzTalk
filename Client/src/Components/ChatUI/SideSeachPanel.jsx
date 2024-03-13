import {
  setUser,
  setSelectedChat,
  setNotification,
  setChats,
} from "../../features/chat/chatSlice";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import PrimarySearchAppBar from "./PrimarySearchAppBar";

const SideSeachPanel = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const user = useSelector((state) => state.chat.user);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter something in search", { autoClose: 5000 });
      return;
    }

    try {
      setLoading(true);
    } catch (error) {
      toast.error("Error Occurred! Failed to Load the Search Results", {
        autoClose: 5000,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
    } catch (error) {
      toast.error(`Error fetching the chat: ${error.message}`, {
        autoClose: 5000,
      });
    }
  };

  return (
    <>
      <PrimarySearchAppBar />
    </>
  );
};

export default SideSeachPanel;
