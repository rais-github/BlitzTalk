import React from "react";
import { Box, useTheme } from "@mui/material";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";
const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const theme = useTheme();
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        alignItems: "center",
        flexDirection: "column",
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        [theme.breakpoints.up("md")]: {
          width: "68%",
        },
        borderRadius: theme.shape.borderRadius,
        borderWidth: "1px",
        borderColor: theme.palette.grey[300],
        borderStyle: "solid",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        },
      }}
      className="rounded-lg shadow-md p-4 bg-white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
