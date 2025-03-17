import React from "react";
import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./layout/layout";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import store from "./store/store";
import { Provider } from "react-redux";
import { fetchSidebar } from "./redux/reducer/sidebardata";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function App() {
  const { status, items, error } = useSelector((state) => state.sidebardata);
  const dispatch = useDispatch();
  const sidebarItems = [
    { name: "Home", link: "/home", icon: "home" },
    { name: "Products", link: "/products", icon: "products" },
    {
      name: "Categories",
      link: "/categories",
      icon: "categories",
      children: [
        { name: "All Categories", link: "/categories" },
        { name: "Add Category", link: "/categories/add" },
      ],
    },
    { name: "Orders", link: "/orders", icon: "orders" },
    { name: "Users", link: "/users", icon: "users" },
    { name: "Settings", link: "/settings", icon: "settings" },
  ];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSidebar());
    }
  }, [status, dispatch]);

  // Define the routes using 'element' instead of 'component'
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Auth />, // Corrected: 'element' for route definition
    },
    {
      path: "/",
      element: <ProtectedRoute element={<Layout />} />,
      children: [
        { path: "home", element: <ProtectedRoute element={<Home />} /> },
      ], // Corrected: 'element' for route definition
    },
  ]);
  return (
    // Assuming the Layout component is used for wrapping the main content
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}

export default App;
