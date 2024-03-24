import { ArrowBack } from "@mui/icons-material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
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
import AmountInput from "../Payment/AmountInput";
import UpdateGroupChatModal from "./GroupUI/UpdateGroupChatModal";
import ScrollableFeed from "./ScrollableFeed";
import Lottie from "react-lottie";
import typingOptions from "../../json/typing.json";
import axios from "axios";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080";
let socket, selectedChatCompare, typingTimeout;
const TYPING_TIMEOUT = 1700;
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: typingOptions,

  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const { user, selectedChat, notification } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
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

      socket.emit("join chat", selectedChat._id);
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
      socket.emit("stop typing", selectedChat._id);
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
        socket.emit("new message", res.data);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        toast.error(err.response.data.message);
        console.log(err);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;
    // console.log("socket", socket);
    socket.on(
      "message recieved",
      (newMessage) => {
        console.log("newMessage", newMessage);
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== newMessage.chat._id
        ) {
          if (!notification.includes(newMessage)) {
            console.log("some", newMessage);
            dispatch(setNotification(newMessage));
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      },
      [fetchAgain, setFetchAgain]
    );

    // Cleanup function
    return () => {
      socket.off("message recieved");
    };
  });
  console.log(notification, "notification");
  // console.log(messages, "messages");
  const handleCurrencyIconClick = () => {
    setShowAmountInput(true);
  };
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
                <IconButton
                  sx={{
                    backgroundColor: "#c9e7c9",
                    "&:hover": {
                      backgroundColor: "#a1d7a1",
                      transform: "scale(1.05)",
                    },
                    "&:focus": {
                      backgroundColor: "#a1d7a1",
                      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
                    },
                  }}
                  onClick={handleCurrencyIconClick}
                >
                  <CurrencyRupeeIcon style={{ fontSize: 19 }} />
                </IconButton>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <IconButton
                  sx={{
                    backgroundColor: "#c9e7c9",
                    "&:hover": {
                      backgroundColor: "#a1d7a1",
                      transform: "scale(1.05)",
                    },
                    "&:focus": {
                      backgroundColor: "#a1d7a1",
                      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
                    },
                  }}
                  onClick={handleCurrencyIconClick}
                >
                  <CurrencyRupeeIcon style={{ fontSize: 20 }} />
                </IconButton>
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
              {istyping && (
                <Lottie
                  options={defaultOptions}
                  // height={50}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              )}
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
      {showAmountInput && (
        <AmountInput
          isGroupChat={selectedChat.isGroupChat}
          onClose={() => setShowAmountInput(false)}
        />
      )}
    </>
  );
};

export default SingleChat;
