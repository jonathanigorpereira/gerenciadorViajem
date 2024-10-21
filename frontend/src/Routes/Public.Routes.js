import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../Pages/Public/Login";
import SignUpPage from "../Pages/Public/SignUp";



export const PublicRoutes = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/cadastrar",
        element: <SignUpPage />
    },
    {
        path: "*",
        element: <Navigate to={"/login"} />
    }
]);