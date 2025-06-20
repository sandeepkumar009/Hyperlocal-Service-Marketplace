import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, children }) {
    const { user } = useAuth();

    // if (!user) return <Navigate to="/login" />;
    // if (role && user.role !== role) return <Navigate to="/unauthorized" />;

    // return children;

    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
