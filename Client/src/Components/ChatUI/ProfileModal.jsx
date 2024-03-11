import React, { useState } from "react";
import {
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";

import {
  Close as CloseIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton style={{ display: "flex" }} onClick={handleOpen}>
          <ViewIcon />
        </IconButton>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 8,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
              {user.name}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ mt: 2, mb: 2, margin: "auto" }}>
              <Avatar
                sx={{ width: 150, height: 150 }}
                src={user.pic}
                alt={user.name}
              />
            </Box>
            <Typography variant="h6" gutterBottom>
              Email: {user.email}
            </Typography>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ProfileModal;
