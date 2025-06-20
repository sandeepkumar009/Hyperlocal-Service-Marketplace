import './index.css'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";

import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import UserDashboard from "./pages/Dashboard/UserDashboard.jsx";
import AdminDashboard from "./pages/Dashboard/AdminDashboard.jsx";
import ProviderDashboard from "./pages/Dashboard/ProviderDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from './pages/Profile/Profile.jsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/userDashboard",
          element: <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>,
          children: [
            {
              path: "profile",
              element: <Profile />
            }
          ]
        },
        {
          path: "/adminDashboard",
          element: <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        },
        {
          path: "/providerDashboard",
          element: <ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>
        }
      ]
    }
  ]
)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
