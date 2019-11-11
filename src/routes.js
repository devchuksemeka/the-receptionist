import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetAuth from "./pages/SetAuth";
import Home from "./pages/Home";
import PrivateRoute from "./PrivateRoute";

const Routes = () => (
  <Router>
    <Switch>
      <PrivateRoute exact path="/inventory" component={Home} />
      <PrivateRoute exact path="/maintenance" component={Home} />
      <PrivateRoute exact path="/overview" component={Home} />
      <PrivateRoute exact path="/sales" component={Home} />
      <Route path="*" component={SetAuth} />
    </Switch>
  </Router>
);

export default Routes;
