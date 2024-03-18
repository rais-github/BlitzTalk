import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setSelectedChat,
  setNotification,
} from "../../features/chat/chatSlice";
import {
  IconButton,
  Typography,
  TextField,
  FormControl,
  Input,
  Box,
  CircularProgress,
} from "@mui/material";
import { getSender, getSenderFull } from "../../Helpers/chatHelpers";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./GroupUI/UpdateGroupChatModal";
import ScrollableFeed from "./ScrollableFeed";
import Lottie from "react-lottie";
import axios from "axios";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { user, selectedChat, notification } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.dir(data);
      setMessages(data);
      setLoading(false);

      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast("Failed to fetch messages", {
        autoClose: 3000,
        type: "error",
        position: "top-right",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newMessage.trim() === "") return;
      const message = {
        content: newMessage,
        chatId: selectedChat._id,
      };
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const res = await axios.post("/api/message", message, config);
        // console.log(res.data);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        toast.error(err.response.data.message);
        console.log(err);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat, fetchAgain]);

  return (
    <>
      {selectedChat && (
        <div className="w-[100%] , h-[92%] -mt-3.5">
          <Typography
            sx={{
              fontFamily: "Work sans",
              fontSize: { xs: "28px", md: "30px" },
              paddingBottom: 3,
              paddingX: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between" },
            }}
          >
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
              }}
              onClick={() => dispatch(setSelectedChat(""))}
            >
              <ArrowBack />
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              overflowY: "hidden",
              bgcolor: "#E5E5E5",
              padding: 3,
            }}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  height: "50px",
                  width: "50px",
                }}
              />
            ) : (
              <div
                className="flex flex-col overflow-y-scroll "
                style={{ scrollbarWidth: "none" }}
              >
                <ScrollableFeed messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} required sx={{ mt: 3 }}>
              <Input
                variant="filled"
                placeholder="Type a message"
                value={newMessage}
                onChange={typingHandler}
                sx={{
                  bgcolor: "#c9e7c9",
                  "& input": { padding: "10px", fontSize: "16px" },
                }}
              />
            </FormControl>
          </Box>
        </div>
      )}
    </>
  );
};

export default SingleChat;
