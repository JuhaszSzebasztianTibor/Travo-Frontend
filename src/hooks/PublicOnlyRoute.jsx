import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/profile" />;
  }
  return children;
};

export default PublicOnlyRoute;
