import { ArrowForward } from "@mui/icons-material";
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
import Lottie from "react-lottie";

import axios from "axios";
// import io from "socket.io-client";
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
  console.log(selectedChat, "selectedChat");
  const dispatch = useDispatch();
  return (
    <>
      {Boolean(selectedChat) ? (
        <>Hello</>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontFamily="Work sans"
            paddingBottom={3}
          >
            No Chat Selected
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
