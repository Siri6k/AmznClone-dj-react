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
import ManageModuleUrls from "./pages/module/ManageModuleUrls";
import CreatePurchaseOrder from "./pages/purchaseOrder/CreatePurchaseOrder";
import ManagePurchaseOrder from "./pages/purchaseOrder/ManagePuchaseOrder";
import HomePage from "./pages/StartPage";
import LegalDocuments from "./pages/docs/LegalDocuments";
import { isAuthenticated } from "./utils/Helper";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserForm from "./pages/users/UserProfilePage";
import ChartExamples from "./tools/ChartExample";
import VisitLogger from "./components/VisitLoggerComponent";
import ContactPage from "./pages/docs/ContactPage";

function App() {
  const { status, items, error } = useSelector((state) => state.sidebardata);
  const { isLoggedIn } = useSelector((state) => state.isLoggedInReducer);
  const dispatch = useDispatch();
  // You can access the current title from Redux if needed
  const currentTitle = useSelector((state) => state.title.pageTitle);

  useEffect(() => {
    if (status === "idle") {
      // Check if the user is authenticated before fetching sidebar data
      if (isAuthenticated()) {
        dispatch(fetchSidebar());
      }
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Fetch sidebar data when the user logs in
    if (isAuthenticated() && isLoggedIn) {
      dispatch(fetchSidebar());
    }
  }, [isLoggedIn]);

  // Define the routes using 'element' instead of 'component'
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Auth />, // Corrected: 'element' for route definition
    },

    {
      path: "/",
      element: <Layout sidebarList={items} />,
      errorElement: (
        <Layout
          sidebarList={items}
          childPage={<Error404Page />}
          pageTitle={currentTitle}
        />
      ),
      children: [
        {
          path: "",
          element: <HomePage />, // Corrected: 'element' for route definition
        },
        {
          path: "home",
          element: <HomePage />, // Corrected: 'element' for route definition
        },
        {
          path: "policies",
          element: <LegalDocuments />, // Corrected: 'element' for route definition
        },
        {
          path: "contact",
          element: <ContactPage />, // Corrected: 'element' for route definition
        },
        { path: "dashboard", element: <ProtectedRoute element={<Home />} /> },
        {
          path: "form/:formName/:id?",
          element: <ProtectedRoute element={<DynamicForm />} />,
        },
        {
          path: "manage/category",
          element: <ProtectedRoute element={<ManageCategories />} />,
        },
        {
          path: "manage/product",
          element: <ProtectedRoute element={<ManageProducts />} />,
        },
        {
          path: "manage/warehouse",
          element: <ProtectedRoute element={<ManageWarehouse />} />,
        },
        {
          path: "manage/users",
          element: <ProtectedRoute element={<ManageUsers />} />,
        },
        {
          path: "manage/moduleUrls",
          element: <ProtectedRoute element={<ManageModuleUrls />} />,
        },
        {
          path: "create/po",
          element: <ProtectedRoute element={<CreatePurchaseOrder />} />,
        },
        {
          path: "create/po/:id?",
          element: <ProtectedRoute element={<CreatePurchaseOrder />} />,
        },
        {
          path: "manage/purchaseOrder",
          element: <ProtectedRoute element={<ManagePurchaseOrder />} />,
        },
        {
          path: "myprofile",
          element: <ProtectedRoute element={<UserForm />} />,
        },
        {
          path: "settings",
          element: <ProtectedRoute element={<ChartExamples />} />,
        },
      ],
    },
  ]);

  return (
    // Assuming the Layout component is used for wrapping the main content
    <>
      <VisitLogger />
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
