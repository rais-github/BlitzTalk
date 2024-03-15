import React from "react";
import { Chip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Chip
      label={
        <>
          <Typography variant="body2">{user.name}</Typography>
          {admin === user._id && (
            <Typography variant="body2">(Admin)</Typography>
          )}
        </>
      }
      variant="outlined"
      color="primary"
      onClick={handleFunction}
      onDelete={handleFunction}
      deleteIcon={<CloseIcon />}
      style={{ margin: 4 }}
    />
  );
};

export default UserBadgeItem;
