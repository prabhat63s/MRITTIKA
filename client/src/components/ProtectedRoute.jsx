import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
    const { user } = useSelector((state) => state.auth);
    const storedUser = localStorage.getItem("user");
    const finalUser = user || (storedUser ? JSON.parse(storedUser) : null);
    const location = useLocation();

    // If not logged in
    if (!finalUser) {
        // Special case: if accessing checkout, force login
        if (location.pathname === "/checkout") {
            return <Navigate to="/auth" state={{ from: location }} replace />;
        }
        // Otherwise redirect home
        return <Navigate to="/" replace />;
    }

    // If role restricted
    if (allowedRoles && !allowedRoles.includes(finalUser.role)) {
        return <Navigate to="/" replace />;
    }

    // Support both wrapper <ProtectedRoute><Page/></ProtectedRoute> and nested <Outlet/>
    return children ? children : <Outlet />;
}
