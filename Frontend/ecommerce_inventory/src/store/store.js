import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../redux/reducer/sidebardata";
import isLoggedInReducer from "../redux/reducer/isLoggedInReducer";
import { titleReducer } from "../redux/reducer/titleReducer";

const store = configureStore({
  reducer: {
    sidebardata: sidebarReducer,
    isLoggedInReducer: isLoggedInReducer,
    title: titleReducer,
  },
});

export default store;
