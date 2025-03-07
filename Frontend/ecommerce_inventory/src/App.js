import React from "react";
import "./App.css";
import Layout from "./utils/Layout";
import ProtectedRoute from "./utils/ProtectedRoute";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthScreen from "./pages/AuthScreen";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";

// Define the routes using 'element' instead of 'component'
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthScreen />, // Corrected: 'element' for route definition
  },
  {
    path: "/home",
    element: <ProtectedRoute element={<Home />} />, // Corrected: 'element' for route definition
  },
]);

function App() {
  return (
    // Assuming the Layout component is used for wrapping the main content
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}

export default App;
