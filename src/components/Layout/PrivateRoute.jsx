import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../Context/auth";
import Layout from './Layout';

const PrivateRoute  = ({
    component: RouteComponent,
    path,
  }) => {
    const isAuthenticated  = useContext(AuthContext);
  
    const routeComponent = (props) => {
      return isAuthenticated ? (
        <Layout key="isAuthenticated">
          {React.createElement(RouteComponent, props)}
        </Layout>
      ) : (
        <Redirect to="/" />
      );
    };
  
    return <Route {...path} render={routeComponent} />;
};

export default PrivateRoute;