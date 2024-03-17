import ScrollableFeed from "react-scrollable-feed";
import { AppBar, Drawer, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Toolbar from "@mui/material/Toolbar";
import { useSelector } from "react-redux";

const ScrollableChat = ({ messages }) => {
  const user = useSelector((state) => state.chat.user);

  return (
    <ScrollableFeed forceScroll={true}>
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {/* Avatar */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                <Avatar
                  className="mt-7 mr-1 cursor-pointer"
                  alt={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            {/* Message */}
            <span
              className={`bg-${
                m.sender._id === user._id ? "blue-200" : "green-200"
              } ${
                isSameUser(messages, m, i, user._id) ? "mt-3" : "mt-10"
              } rounded-2xl px-5 py-3 max-w-3/4`}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
