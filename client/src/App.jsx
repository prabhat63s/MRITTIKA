import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AxiosInterceptor from "./components/AxiosInterceptor";
import Loader from "./components/Loader";
import OrderSuccess from "./pages/OrderSuccess";

// Lazy imports
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const UserOrders = lazy(() => import("./pages/user/UserOrders"));
const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCategory = lazy(() => import("./pages/admin/AdminCategory"));
const AdminAddProduct = lazy(() => import("./pages/admin/AdminAddProduct"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));


function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen text-gray-600">
      <Loader />
    </div>
  );
}

export default function App() {
  return (
    <>
      <AxiosInterceptor />

      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Collections overview */}
            <Route path="/collections/:category" element={<CollectionPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />

            <Route path="/about" element={<AboutPage />} />

            {/* Authentication routes */}
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User-related routes */}
            <Route
              path="/user"
              element={<ProtectedRoute allowedRoles={["user"]} />}
            >
              <Route path="profile" element={<UserProfile />} />
              <Route path="orders" element={<UserOrders />} />
            </Route>

            {/* Admin-related routes */}
            <Route
              path="/admin"
              element={<ProtectedRoute allowedRoles={["admin"]} />}
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="category" element={<AdminCategory />} />
              <Route path="product">
                <Route index element={<AdminProducts />} />
                <Route path="add" element={<AdminAddProduct />} />
                <Route path="edit/:id" element={<AdminAddProduct />} />
              </Route>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* Fallback route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
