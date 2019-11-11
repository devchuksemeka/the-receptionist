import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated, setAuthToken, logOut } from "./helpers/auth";

/**
 * HOC for authentication
 * @class PrivateRoute
 * @extends {React.Component}
 */
class PrivateRoute extends React.Component {
  isLogged;

  constructor() {
    super();
    this.isLogged = isAuthenticated();
    if (this.isLogged) {
      setAuthToken();
    } else {
      logOut();
    }
  }

  /**
   * @returns {Component}
   * @memberOf PrivateRoute
   */
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.isLogged ? (
            <>
              <Component {...props} />
            </>
          ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
        }
      />
    );
  }
}

export default PrivateRoute;
