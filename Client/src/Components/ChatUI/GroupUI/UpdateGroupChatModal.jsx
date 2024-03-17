import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../../../features/chat/chatSlice";
import UserListItem from "../../UserAvatar/UserListItem";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CircularProgress,
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
import {
  Close as CloseIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, selectedChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const handleOpenClose = () => {
    setOpen(!open);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      toast.error("Failed To Load Search", {
        autoClose: 4500,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log("Error due to", error.response.data.message);
      toast.error("Failed To Rename Chat", {
        autoClose: 4500,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!", {
        autoClose: 4500,
        position: "bottom-left",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only Admins can add!", {
        autoClose: 4500,
        position: "bottom-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log("Error due to", error.response.data.message);
      toast.error("Failed To Add User", {
        autoClose: 4500,
        position: "bottom-left",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only Admins can remove", {
        autoClose: 4500,
        position: "bottom-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id
        ? dispatch(setSelectedChat())
        : dispatch(setSelectedChat(data));
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.log("Error at removal due to", error.message);
      toast.error("Error Occurred", {
        autoClose: 4500,
        position: "bottom-left",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton onClick={handleOpenClose} sx={{ display: "flex" }}>
        <ViewIcon />
      </IconButton>

      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "orange",
        }}
        keepMounted
        open={open}
        onClose={handleOpenClose}
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
            <IconButton
              onClick={handleOpenClose}
              className="absolute top-2 right-2"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h4" className="text-center mb-4">
              {selectedChat.chatName}
            </Typography>
            <Box className="flex flex-col items-center">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <div className="flex items-center justify-between mt-4">
              <TextField
                placeholder="Chat Name"
                className="w-2/3 mr-2"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!groupChatName || renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </div>
            <div className="mt-4">
              <TextField
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="flex justify-center mt-4">
                <CircularProgress />
              </div>
            ) : (
              <div className="flex flex-col items-center mt-4">
                {searchResult.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-col items-center mt-4">
              <Button
                onClick={() => handleRemove(user)}
                variant="contained"
                color="error"
              >
                Leave Group
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
