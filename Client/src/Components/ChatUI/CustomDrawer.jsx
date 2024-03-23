import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { setChats, setSelectedChat } from "../../features/chat/chatSlice";
import CircularProgress from "@mui/material/CircularProgress";
export default function CustomDrawer({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const user = useSelector((state) => state.chat.user);
  const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter Something In Search", {
        autoClose: 4500,
        position: "top-right",
      });
    } else {
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`/api/user?search=${search}`, config);

        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast.error("Failed to Search The Result", {
          autoClose: 4400,
          position: "bottom-left",
        });
      }
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    // console.log(user);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      console.log(data);
      if (!chats.find((c) => c._id === data._id)) dispatch(setChats(data));
      dispatch(setSelectedChat(data));
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast.error("Error fetching the chat", {
        description: error.message,
        autoClose: 5000,
        position: "bottom-left",
      });
    }
  };

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <ToastContainer />
      <Backdrop
        open={isOpen}
        sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
        onClick={handleBackdropClick}
      >
        {/* Custom overlay styling */}
      </Backdrop>
      <Box
        sx={{
          width: 310,
          zIndex: (theme) => theme.zIndex.drawer,
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            borderBottomWidth: "1px",
            padding: "1rem",
          }}
        >
          <Typography variant="h6">Search Users</Typography>
        </Box>
        <Box padding="1rem">
          <Box display="flex" paddingBottom={2}>
            <Input
              placeholder="Search by name or email"
              marginright={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <CircularProgress color="secondary" />}
        </Box>
      </Box>
    </Drawer>
  );
}
