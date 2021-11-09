import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Route, Redirect, useLocation } from "react-router-dom";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const { state } = useLocation();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isStakeAuthLoading) {
          return <div className="text-center">Loading...</div>;
        }
        if (!stakeToken) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};
