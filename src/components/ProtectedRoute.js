import { useSelector } from "react-redux";
import { Navigate, Outlet, Route } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
