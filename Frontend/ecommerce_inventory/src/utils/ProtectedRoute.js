import { Navigate } from "react-router-dom";
import { isAuthenticated, refreshToken } from "./Helper";

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/auth" />;
};

export default ProtectedRoute;
