import React from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import {
  isSameSender,
  isLastMessage,
  isSameUser,
  isSameSenderMargin,
} from "../../Helpers/chatHelpers";

const ScrollableChat = ({ messages, emotion, translatedLang = "English" }) => {
  const user = useSelector((state) => state.chat.user);
  return (
    <ScrollableFeed forceScroll={true}>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {/* Avatar */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.name} placement="bottom-start">
                <Avatar
                  style={{ marginTop: "7px", marginRight: "8px" }}
                  alt={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            {/* Message */}
            <span
              style={{
                backgroundColor:
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id)
                  ? "3px"
                  : "10px",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
