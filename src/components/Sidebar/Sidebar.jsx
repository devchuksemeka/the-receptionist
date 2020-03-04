import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";
import AuthContext from '../../context/AuthContext'

import logo from "assets/img/reactlogo.png";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };
  }
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {
    // const sidebarBackground = {
    //   backgroundImage: "url(" + this.props.image + ")"
    // };
    return (
      <AuthContext.Consumer>
        {context =>(
          <div
            id="sidebar"
            className="sidebar"
            data-color={this.props.color}
            data-image={this.props.image}
          >
            {this.props.hasImage ? (
              <div className="sidebar-background" style={{
                backgroundImage: "url(" + this.props.image + ")"
              }} />
              // <div className="sidebar-background" style={sidebarBackground} />
            ) : (
              null
            )}
            <div className="logo">
              <NavLink to="#" className="simple-text logo-mini" >
                <div className="logo-img">
                  <img src={logo} alt="logo_image" />
                </div>
              </NavLink>
              <NavLink to="/overview" className="simple-text logo-normal" >
                Releaf OAT
              </NavLink>
            </div>
            <div className="sidebar-wrapper">
              <ul className="nav">
                {this.state.width <= 991 ? <AdminNavbarLinks /> : null}
                {this.props.routes.map((prop, key) => {
                  if (!prop.redirect)
                    return (
                      <>
                      {prop.permissions && prop.permissions.length > 0 && context.permissions.some(r=>prop.permissions.includes(r)) && (<li
                        className={this.activeRoute(prop.path)}
                        key={key}
                      >
                        <NavLink to={prop.path} className="nav-link" activeClassName="active">
                          <i className={prop.icon} />
                          <p>{prop.name}</p>
                        </NavLink>
                      </li>) 
                      }
                      </>
                      );
                  return null;
                })}
              </ul>
            </div>
          </div>
        )}
      </AuthContext.Consumer>

    );
  }
}

export default Sidebar;
