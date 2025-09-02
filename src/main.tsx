// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import SignIn from "./pages/Signin";
import RequireAuth from "./components/RequireAuth";
import CheckEmail from "./pages/CheckEmail"; // ⟵ ADD
import "./index.css";

const router = createBrowserRouter([
  { path: "/signin", element: <SignIn /> },
  { path: "/check-email", element: <CheckEmail /> }, // ⟵ ADD
  { path: "/", element: <RequireAuth><App /></RequireAuth> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);