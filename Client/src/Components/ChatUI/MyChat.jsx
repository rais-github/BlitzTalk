import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchChats } from "../../features/chat/chatSlice";
import ChatLoading from "./ChatLoading";
import Box from "@mui/material/Box";

const MyChat = ({ fetchAgain }) => {
  const dispatch = useDispatch();
  const { user, selectedChat } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchChats()).catch((error) => {
      toast("Failed To Load Chats", {
        autoClose: 4500,
        position: "bottom-left",
      });
    });
  }, [dispatch, user, fetchAgain]);

  if (!user) {
    return <div>Please log in to view chats.</div>;
  }

  return (
    <Box
      sx={{
        display: selectedChat ? "none" : "flex",
        md: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        md: "31%",
        borderRadius: "10px",
        border: "1px solid #e0e0e0",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          fontFamily: "Work Sans",
          fontSize: "20px",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      ></Box>
    </Box>
  );
};

export default MyChat;
