import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../features/chat/chatSlice.js";
import { Box } from "@mui/material";
import { SideSearchPanel, MyChat, ChatBox } from "../Components";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  const user = useSelector((state) => state.chat.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(setUser({ id: 1, name: "John Doe" }));
  //   navigate("/");
  // }, [dispatch, navigate]);

  const renderChatComponents = () => (
    <>
      <MyChat fetchAgain={fetchAgain} />
      <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </>
  );

  return (
    <Box width="100%">
      {user && <SideSearchPanel />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        {user && renderChatComponents()}
      </Box>
    </Box>
  );
};

export default Chat;
