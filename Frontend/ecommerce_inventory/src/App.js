import React from "react";
import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./layout/layout";

import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { fetchSidebar } from "./redux/reducer/sidebardata";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DynamicForm from "./pages/DynamicForm";

import "./style/style.css";
import ManageCategories from "./pages/category/Managecategories";
import ManageProducts from "./pages/product/ManageProducts";
import Error404Page from "./pages/Error404Page";
import ManageWarehouse from "./pages/warehouse/ManageWarehouse";
import ManageUsers from "./pages/users/ManageUsers";

function App() {
  const { status, items, error } = useSelector((state) => state.sidebardata);
  const dispatch = useDispatch();

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
      element: <Layout sidebarList={items} />,
      errorElement: <Layout sidebarList={items} childPage={<Error404Page />} />,
      children: [
        { path: "/", element: <ProtectedRoute element={<Home />} /> },
        { path: "/home", element: <ProtectedRoute element={<Home />} /> },
        {
          path: "/form/:formName/:id?",
          element: <ProtectedRoute element={<DynamicForm />} />,
        },
        {
          path: "/manage/category",
          element: <ProtectedRoute element={<ManageCategories />} />,
        },
        {
          path: "/manage/product",
          element: <ProtectedRoute element={<ManageProducts />} />,
        },
        {
          path: "/manage/warehouse/",
          element: <ProtectedRoute element={<ManageWarehouse />} />,
        },
        {
          path: "manage/users/",
          element: <ProtectedRoute element={<ManageUsers />} />,
        },
      ],
    },
  ]);

  return (
    // Assuming the Layout component is used for wrapping the main content
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
}

export default App;
