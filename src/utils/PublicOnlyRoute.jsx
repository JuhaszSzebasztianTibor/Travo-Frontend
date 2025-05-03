import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/profile" />;
  }
  return children;
};

export default PublicOnlyRoute;
