import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../../features/chat/chatSlice";
import UserListItem from "../../UserAvatar/UserListItem";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Button,
  Typography,
  Box,
  Avatar,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GroupModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const user = useSelector((state) => state.chat.user);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added to the group", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      // setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching users", {
        position: "top-right",
        autoClose: 2000,
      });
      setLoading(false);
    }
  };

  const removeUser = (userToRemove) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.error("Please enter chat name and add users", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
          name: groupChatName,
        },
        config
      );
      //   const check = selectedUsers.map((u) => u._id);
      //   console.log(check);
      console.log(data);
      dispatch(setChats(data));
      setOpen(false);
      // setGroupChatName("");
      // setSelectedUsers([]);
      toast.success("Group Chat Created", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error creating group chat", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <span onClick={handleOpen}>{children}</span>
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
            }}
          >
            <IconButton
              style={{ position: "absolute", right: 10, top: 10 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h3" align="center" mb={4}>
              Create Group Chat
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextField
                label="Chat Name"
                variant="outlined"
                fullWidth
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                sx={{ marginBottom: 3 }}
              />
              <TextField
                label="Add Users eg: John, Piyush, Jane"
                variant="outlined"
                fullWidth
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ marginBottom: 3 }}
              />
              <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4) //there could be more result but it is done so that it does not take much space
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Box>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              fullWidth
            >
              Create Chat
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default GroupModal;
