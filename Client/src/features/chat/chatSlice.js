import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

const initialState = {
  selectedChat: null,
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  notification: [],
  chats: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setUser: (state, action) => {
      const userInfo = action.payload;

      state.user = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    setNotification: (state, action) => {
      state.notification = [...state.notification, action.payload];
    },

    setChats: (state, action) => {
      state.chats = [...state.chats, action.payload];
    },
  },
});

// Export the generated actions
export const { setSelectedChat, setUser, setNotification, setChats } =
  chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
