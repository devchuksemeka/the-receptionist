import React, { Component } from "react";
import { Route, Switch,Redirect } from "react-router-dom";
import Footer from "components/Footer/Footer";
import Navbar from "components/Navbars/Navbar";
import routes from "routes.js";

import image from "assets/img/sidebar-3.jpg";

export default class Default extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open"
    };
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/") {
        return (
          <Route
            path={prop.path}
            component={prop.component}
            exact
            key={key}
          />
        );
      } else {
        return (
          <Redirect to="/" key={key}/>
        );
      }
    });
  };
  
  componentDidMount() {
   
  }
  componentDidUpdate(e) {
   
  }
  render() {
    return (
      <div className="wrapper">
        <div id="main-panel" className="" ref="mainPanel">
          <Navbar
            {...this.props}
            // brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
        </div>
      </div>
    );
  }
}
