import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../redux/reducer/sidebardata";
import isLoggedInReducer from "../redux/reducer/isLoggedInReducer";

const store = configureStore({
  reducer: {
    sidebardata: sidebarReducer,
    isLoggedInReducer: isLoggedInReducer,
  },
});

export default store;
