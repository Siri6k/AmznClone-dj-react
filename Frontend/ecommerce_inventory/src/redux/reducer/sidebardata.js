import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSidebar = createAsyncThunk("data/fetchSidebar", async () => {
  const response = await axios.get("http://localhost:8000/api/getMenus");
  let sidebarData = response.data.data;
  const setActiveAndExpanded = (item) => {
    if (item.module_url && window.location.pathname === item.module_url) {
      item.active = true;
      item.expanded = true;
      return true;
    }
    if (item.submenus && item.submenus.length > 0) {
      return item.submenus.some((submenu) => setActiveAndExpanded(submenu));
    }
    return false;
  };
  sidebarData.forEach((item) => {
    if (setActiveAndExpanded(item)) {
      item.expanded = true;
    }
  });
  return sidebarData;
});

const sidebarSlice = createSlice({
  name: "data",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    expandItem: (state, action) => {
      const { id } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.expanded = !item.expanded;
      }
    },
    activateItem(state, action) {
      state.items.forEach((item) => {
        item.active = false;
        item.expanded = false;
        item.submenus?.forEach((submenu) => {
          submenu.active = false;
          if (submenu.id === action.payload.item.id) {
            submenu.active = true;
          }
        });
        if (
          item.id === action.payload.item?.id ||
          item.id === action.payload.item?.parent_id
        ) {
          item.active = true;
          item.expanded = true;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSidebar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSidebar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { expandItem, activateItem } = sidebarSlice.actions;
export default sidebarSlice.reducer;
