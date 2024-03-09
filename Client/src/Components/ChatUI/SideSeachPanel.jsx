import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setUser,
  setSelectedChat,
  setNotification,
  setChats,
} from "../../features/chat/chatSlice";
import { useSelector, useDispatch } from "react-redux";

const SideSeachPanel = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  return <></>;
};

export default SideSeachPanel;
