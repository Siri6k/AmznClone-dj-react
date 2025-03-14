import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../redux/reducer/sidebardata";

const store = configureStore({
  reducer: {
    sidebardata: sidebarReducer,
  },
});

export default store;
