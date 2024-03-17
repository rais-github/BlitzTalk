import React from "react";
import { Avatar, useTheme } from "@mui/material";
import { orange } from "@mui/material/colors";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ConversationIcon from "@mui/icons-material/Forum";
import { styled } from "@mui/system";

const icons = [<ChatIcon />, <NotificationsIcon />, <ConversationIcon />];

const StyledAvatar = styled(Avatar)({
  animation: "bounce 1s infinite alternate",
  "@keyframes bounce": {
    "0%": {
      transform: "translateY(-2rem)",
    },
    "100%": {
      transform: "translateY(0.8rem)",
    },
  },
});

const RotatingLogo = () => {
  const [index, setIndex] = React.useState(0);
  const theme = useTheme();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledAvatar sx={{ bgcolor: orange[500], width: 80, height: 80 }}>
      {icons[index]}
    </StyledAvatar>
  );
};

export default RotatingLogo;
