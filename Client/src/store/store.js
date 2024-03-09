import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chat/chatSlice.js";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
