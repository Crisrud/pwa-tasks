import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    console.log("Current User in PrivateRoute:", currentUser);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
}