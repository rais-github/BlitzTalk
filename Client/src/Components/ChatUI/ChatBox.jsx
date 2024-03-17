import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";
import RotatingLogo from "./RotatingLogo";
const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const theme = useTheme();
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  return (
    <>
      {selectedChat ? (
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
      ) : (
        <Box
          sx={{
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <RotatingLogo />
          <Typography
            variant="h3"
            align="center"
            fontFamily="Work Sans"
            sx={{
              paddingBottom: 3,
              fontWeight: 600,
              color: "#333",
            }}
          >
            No Chat Selected
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Chatbox;
