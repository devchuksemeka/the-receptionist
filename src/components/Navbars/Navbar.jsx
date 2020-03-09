import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import logo from "assets/img/reactlogo.png";
import { NavLink } from "react-router-dom";

import NavbarLinks from "./NavbarLinks.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }
  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function() {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }
  render() {
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <NavLink to="/" className="simple-text logo-mini" >
              <div className="logo-img">
                <img src={logo} alt="logo_image" style={{height:"35px"}} />
                Client Name
              </div>
            </NavLink>
            {/* <NavLink to="/" className="logo-normal" >
              Sleek Receptionist
            </NavLink> */}
          </Navbar.Brand>
          <Navbar.Toggle onClick={this.mobileSidebarToggle} />
        </Navbar.Header>
        <Navbar.Collapse>
          <NavbarLinks />
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
