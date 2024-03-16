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
import GroupModal from "./GroupUI/GroupModal";

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
          display: { xs: selectedChat ? "none" : "flex", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          padding: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease",
          "@media (min-width:600px)": {
            width: "31%",
          },
          "&:hover": {
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
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
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5">Chats</Typography>
          <GroupModal>
            <Button
              endIcon={<ArrowRightIcon />}
              sx={{
                fontSize: "20px",
                md: { fontSize: "30px" },
              }}
              color="warning"
              variant="contained"
            >
              New Group Chat
            </Button>
          </GroupModal>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            overflowY: "auto",
            borderRadius: "10px",
            bgcolor: "#F8F8F8",
            padding: "10px",
          }}
        >
          {chats ? (
            <Stack direction="column" spacing={2}>
              {chats.map((chat, index) => (
                <Box
                  onClick={() => dispatch(setSelectedChat(chat))}
                  key={chat.id || index}
                  cursor="pointer"
                  bgcolor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  paddingX={3}
                  paddingY={2}
                  borderRadius={2}
                  transition="background-color 0.3s ease"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(110, 70, 11, 0.7)",
                      color: "white",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      fontFamily: "Work Sans",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "auto",
                      cursor: "pointer",
                    }}
                  >
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
