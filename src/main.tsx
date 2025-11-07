// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Landing from "./pages/Landing";
import SignIn from "./pages/Signin";
import RequireAuth from "./components/RequireAuth";
import CheckEmail from "./pages/CheckEmail";
import Profile from "./pages/Profile";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/profile", element: <RequireAuth><Profile /></RequireAuth> }, 
  { path: "/check-email", element: <CheckEmail /> },
  { path: "/app", element: <RequireAuth><App /></RequireAuth> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
