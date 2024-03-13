import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Paper
      onClick={handleFunction}
      elevation={3}
      sx={{
        cursor: "pointer",
        background: "#E8E8E8",
        "&:hover": {
          background: "#38B2AC",
          color: "white",
        },
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: "black",
        padding: "8px",
        marginBottom: "8px",
        borderRadius: "lg",
      }}
    >
      <Avatar
        sx={{ marginRight: "8px", width: "32px", height: "32px" }}
        alt={user.name}
        src={user.pic}
      />
      <Box>
        <Typography variant="body1">{user.name}</Typography>
        <Typography variant="body2">
          <b>Email: </b>
          {user.email}
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserListItem;
