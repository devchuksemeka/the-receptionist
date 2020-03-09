import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import { NavLink } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <p className="copyright pull-left">
            &copy; {new Date().getFullYear()}{" "}
            <NavLink
              to="#">
              Client Name
            </NavLink>
            &nbsp; All Right Reserved.
          </p>
          <p className="copyright pull-right">
            Powered By &nbsp;
            <NavLink
              to="#">
              Sleek Tech Services (STS)
            </NavLink>
          </p>
          {/* <nav className="pull-left">
            <ul>
              <li>
                <a href="#pablo">Home</a>
              </li>
              <li>
                <a href="#pablo">Company</a>
              </li>
              <li>
                <a href="#pablo">Portfolio</a>
              </li>
              <li>
                <a href="#pablo">Blog</a>
              </li>
            </ul>
          </nav> */}
          
        </Grid>
      </footer>
    );
  }
}

export default Footer;
