import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);

  if (isStakeAuthLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return stakeToken ? children : <Navigate to="/login" />;
};
