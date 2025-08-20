import React, { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import "./style/style.css";

import Layout from "./layout/layout";
import { fetchSidebar } from "./redux/reducer/sidebardata";
import { isAuthenticated } from "./utils/Helper";
import ProtectedRoute from "./utils/ProtectedRoute";

// Lazy pages (réduire bundle initial)
const Auth = lazy(() => import("./pages/Auth"));
const HomePage = lazy(() => import("./pages/StartPage"));
const LegalDocuments = lazy(() => import("./pages/docs/LegalDocuments"));
const UserProfile = lazy(() => import("./pages/users/UserProfile"));
const ProductPage = lazy(() => import("./pages/product/ProductPage"));
const ContactPage = lazy(() => import("./pages/docs/ContactPage"));
const Home = lazy(() => import("./pages/Home"));
const DynamicForm = lazy(() => import("./pages/DynamicForm"));
const ManageCategories = lazy(() =>
  import("./pages/category/Managecategories")
);
const ManageProducts = lazy(() => import("./pages/product/ManageProducts"));
const ManageWarehouse = lazy(() => import("./pages/warehouse/ManageWarehouse"));
const ManageUsers = lazy(() => import("./pages/users/ManageUsers"));
const ManageModuleUrls = lazy(() => import("./pages/module/ManageModuleUrls"));
const CreatePurchaseOrder = lazy(() =>
  import("./pages/purchaseOrder/CreatePurchaseOrder")
);
const ManagePurchaseOrder = lazy(() =>
  import("./pages/purchaseOrder/ManagePuchaseOrder")
);
const ProfilePageForm = lazy(() => import("./pages/users/ProfilePageForm"));
const ChartExamples = lazy(() => import("./tools/ChartExample"));
const Error404Page = lazy(() => import("./pages/Error404Page"));

// loader sécurisé (bloque avant render)
const protectedLoader = () => (isAuthenticated() ? null : redirect("/auth"));

function App() {
  const { items } = useSelector((state) => state.sidebardata);
  const { isLoggedIn } = useSelector((state) => state.isLoggedInReducer);
  const dispatch = useDispatch();

  // 1 seul useEffect : charge sidebar si authentifié
  useEffect(() => {
    if (isAuthenticated()) dispatch(fetchSidebar());
  }, [isLoggedIn]); // isLoggedIn change → re-fetch

  const router = createBrowserRouter([
    {
      path: "/auth",
      element: (
        <Suspense>
          <Auth />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: (
        <Suspense>
          <Layout sidebarList={items} />
        </Suspense>
      ),
      errorElement: (
        <Suspense>
          <Layout sidebarList={items} childPage={<Error404Page />} />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense>
              <HomePage />
            </Suspense>
          ),
        },
        {
          path: "home",
          element: (
            <Suspense>
              <HomePage />
            </Suspense>
          ),
        },
        {
          path: "policies",
          element: (
            <Suspense>
              <LegalDocuments />
            </Suspense>
          ),
        },
        {
          path: "profile/:id",
          element: (
            <Suspense>
              <UserProfile />
            </Suspense>
          ),
        },
        {
          path: "product/:id",
          element: (
            <Suspense>
              <ProductPage />
            </Suspense>
          ),
        },
        {
          path: "contact",
          element: (
            <Suspense>
              <ContactPage />
            </Suspense>
          ),
        },

        // pages protégées
        {
          path: "dashboard",
          element: (
            <Suspense>
              <ProtectedRoute element={<Home />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "form/:formName/:id?",
          element: (
            <Suspense>
              <ProtectedRoute element={<DynamicForm />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "manage/category",
          element: (
            <Suspense>
              <ProtectedRoute element={<ManageCategories />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "manage/product",
          element: (
            <Suspense>
              <ProtectedRoute element={<ManageProducts />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "manage/warehouse",
          element: (
            <Suspense>
              <ProtectedRoute element={<ManageWarehouse />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "manage/users",
          element: (
            <Suspense>
              <ProtectedRoute element={<ManageUsers />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "manage/moduleUrls",
          element: (
            <Suspense>
              <ProtectedRoute element={<ManageModuleUrls />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "create/po",
          element: (
            <Suspense>
              <ProtectedRoute element={<CreatePurchaseOrder />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "create/po/:id?",
          element: (
            <Suspense>
              <ProtectedRoute element={<CreatePurchaseOrder />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "manage/purchaseOrder",
          element: (
            <Suspense>
              <ProtectedRoute element={<ManagePurchaseOrder />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "myprofile",
          element: (
            <Suspense>
              <ProtectedRoute element={<ProfilePageForm />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
        {
          path: "settings",
          element: (
            <Suspense>
              <ProtectedRoute element={<ChartExamples />} />
            </Suspense>
          ),
          loader: protectedLoader,
        },
      ],
    },
  ]);

  return (
    <>
      <Suspense
        fallback={
          <div style={{ padding: 40, textAlign: "center" }}>⏳ Chargement…</div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
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
