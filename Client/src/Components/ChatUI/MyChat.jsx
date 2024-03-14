import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchChats } from "../../features/chat/chatSlice";
import { setSelectedChat } from "../../features/chat/chatSlice";
import ChatLoading from "./ChatLoading";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { getSender } from "../../Helpers/chatHelpers";

const MyChat = ({ fetchAgain }) => {
  const [loggedInUser, setLoggedInUser] = React.useState();
  const dispatch = useDispatch();
  const { user, selectedChat } = useSelector((state) => state.chat);
  const chats = useSelector((state) => state.chat.chats);
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));

    if (!user) return;
    dispatch(fetchChats()).catch((error) => {
      toast("Failed to Load Chats", {
        autoClose: 4500,
        position: "bottom-left",
      });
    });
  }, [dispatch, user, fetchAgain]);

  if (!user) {
    return <div>Please log in to view chats.</div>;
  }

  return (
    <>
      <Box
        sx={{
          display: selectedChat ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          padding: "20px",
          "@media (min-width:600px)": {
            width: "31%",
          },
        }}
      >
        <ToastContainer />
        <Box
          sx={{
            display: "flex",
            fontFamily: "Work Sans",
            fontSize: "20px",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          My Chats
          <Button
            endIcon={<ArrowRightIcon />}
            sx={{
              display: "flex",
              fontSize: "20px",
              md: { fontSize: "30px" },
            }}
            color="warning"
            variant="outlined"
          >
            New Group Chat
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            overflowY: "hidden",
            borderRadius: "10px",
            bgcolor: "#F8F8F8",
          }}
        >
          {chats ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {chats.map((chat, index) => (
                <Box
                  onClick={() => dispatch(setSelectedChat(chat))}
                  key={chat.id || index}
                  cursor="pointer"
                  bgcolor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  paddingX={3}
                  paddingY={2}
                  borderRadius={10}
                >
                  <Typography>
                    {!chat.isGroupChat
                      ? getSender(loggedInUser, chat.users)
                      : chat.chatName}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChat;
