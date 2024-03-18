import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().chat;
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get("/api/chat", config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch chats");
    }
  }
);

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
      state.notification = [action.payload, ...state.notification];
    },

    setChats: (state, action) => {
      state.chats = [...state.chats, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state, action) => {
        state.chats = [];
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.chats = [];
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      });
  },
});

// Export the generated actions
export const { setSelectedChat, setUser, setNotification, setChats } =
  chatSlice.actions;

// Export the reducer
export default chatSlice.reducer;
