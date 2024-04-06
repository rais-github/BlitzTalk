import { ArrowBack } from "@mui/icons-material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import compromise from "compromise";
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Stack from "@mui/material/Stack";
import "react-toastify/dist/ReactToastify.css";
import {
  setSelectedChat,
  setNotification,
  setEmotion,
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
import { detectEmotion } from "../../Helpers/detectEmotion";
import ProfileModal from "./ProfileModal";
import AmountInput from "../Payment/AmountInput";
import UpdateGroupChatModal from "./GroupUI/UpdateGroupChatModal";
import ScrollableFeed from "./ScrollableFeed";
import EmoteSwitch from "./EmoteSwitch";
import TranslateSwitch from "./TranslateSwitch";
import Lottie from "react-lottie";
import typingOptions from "../../json/typing.json";
import { countries } from "../../json/countries";
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

const getLanguageCode = (languageName) => {
  return countries[languageName] || null;
};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [isEmoteOn, setIsEmoteOn] = useState(false);
  const [isTranslateOn, setIsTranslateOn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const analyzer = new SentimentIntensityAnalyzer();
  const { user, selectedChat, notification, emotion } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();
  const nlp = compromise;

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

      const senderLanguage = user.language || "English";
      const senderEmail = user.email;
      let translatedMessage = newMessage;

      if (selectedChat.users && selectedChat.users.length === 2) {
        const receiver = selectedChat.users.find(
          (user) =>
            user.email !== senderEmail && user.language !== senderLanguage
        );

        if (receiver && isTranslateOn) {
          const receiverLanguage = receiver.language;
          const translateFromCode = getLanguageCode(senderLanguage);
          const translateToCode = getLanguageCode(receiverLanguage);
          // console.log("translateFromCode", translateFromCode);
          // console.log("translateToCode", translateToCode);
          // console.log("receiverLanguage", receiverLanguage);
          // console.log("senderLanguage", senderLanguage);
          if (!translateFromCode || !translateToCode) {
            console.log("Error: Language codes not found for translation.");
            return;
          }

          const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            newMessage
          )}&langpair=${translateFromCode}|${translateToCode}`;

          try {
            const response = await axios.get(apiUrl);
            if (
              response.data &&
              response.data.responseData &&
              response.data.responseData.translatedText
            ) {
              translatedMessage = response.data.responseData.translatedText;
            } else {
              console.log("Translation API response is missing required data.");
            }
          } catch (error) {
            console.log("Error occurred while translating:", error.message);
            // Handle translation error gracefully, fallback to original message
            translatedMessage = newMessage;
          }
        } else {
          console.log("No suitable receiver found.");
        }
      }

      // console.log("translatedMessage", translatedMessage);
      // console.log("newMessage", newMessage);

      let messageContent = translatedMessage;
      let emoji = "";
      const detectedEmotion = detectEmotion(newMessage);

      switch (detectedEmotion || emotion) {
        case "hello":
          emoji = "🙏";
          break;
        case "bye":
          emoji = "👋🏼";
          break;
        case "excited":
          emoji = "🤩";
          break;
        case "ashamed":
          emoji = "😳";
          break;
        case "calm":
          emoji = "😌";
          break;
        case "joy":
          emoji = "😂";
          break;
        case "love":
          emoji = "❤️";
          break;
        case "sad":
          emoji = "😔";
          break;
        case "irritated":
          emoji = "😠";
          break;
        case "angry":
          emoji = "😡";
          break;
        case "bored":
          emoji = "😒";
          break;
        case "curious":
          emoji = "🤔";
          break;
        case "blank":
          emoji = "❓";
          break;
        default:
          emoji = "";
      }

      if (emoji && isEmoteOn) {
        // Attach emoji to message content
        messageContent += ` ${emoji}`;
      }

      const message = {
        content: messageContent,
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
        // setMessages([...messages, emotion]);
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
        // setEmotion((prevEmotion) => newMessage.answer);
        console.log("backendEmotion", newMessage.answer);
        dispatch(setEmotion(newMessage.answer));
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

  const handleCurrencyIconClick = () => {
    setShowAmountInput(true);
  };
  return (
    <>
      {selectedChat && (
        <div className="w-full h-[92%] -mt-3.5">
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
                <Stack direction="row" spacing={0} style={{ marginLeft: -21 }}>
                  <EmoteSwitch
                    label="Emote"
                    onClick={(e) => {
                      console.log("Emote switch clicked");
                      setIsEmoteOn(!isEmoteOn);
                    }}
                    style={{ marginLeft: 5 }}
                  />
                  <TranslateSwitch
                    label="Translate"
                    onClick={(e) => {
                      console.log("Translate switch clicked");
                      setIsTranslateOn(!isTranslateOn);
                    }}
                    style={{ marginLeft: 5 }}
                  />
                </Stack>

                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {/* <IconButton
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
              </IconButton> */}
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
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
                <ScrollableFeed messages={messages} emotion={emotion} />
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
