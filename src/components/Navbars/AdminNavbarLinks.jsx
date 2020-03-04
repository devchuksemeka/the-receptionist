import React, { Component } from "react";
import { NavItem, Nav, 
  NavDropdown, 
  // MenuItem 
} from "react-bootstrap";
import AuthContext from '../../context/AuthContext';
import axios from "axios"
import {toTitleCase} from '../../helpers'

class AdminNavbarLinks extends Component {
  state={

  }

  updateRecordFromSheet = async () =>{
    
    const update_db = await axios.get(`${process.env.REACT_APP_SERVER_ENDPOINT}/v1/generals/update-from-sheet`)
    alert(update_db.data.message)
    window.location.reload(true);
  }

  static contextType = AuthContext;

  render() {
    // const notification = (
    //   <div>
    //     <i className="fa fa-globe" />
    //     <b className="caret" />
    //     <span className="notification">5</span>
    //     <p className="hidden-lg hidden-md">Notification</p>
    //   </div>
    // );
    return (
      <AuthContext.Consumer>
        {context => (
          <div>
          <Nav>
            {/* <NavItem eventKey={1} href="#">
              <i className="fa fa-dashboard" />
              <p className="hidden-lg hidden-md">Dashboard</p>
            </NavItem> */}
            {/* <NavDropdown
              eventKey={2}
              title={notification}
              noCaret
              id="basic-nav-dropdown"
            >
              <MenuItem eventKey={2.1}>Notification 1</MenuItem>
              <MenuItem eventKey={2.2}>Notification 2</MenuItem>
              <MenuItem eventKey={2.3}>Notification 3</MenuItem>
              <MenuItem eventKey={2.4}>Notification 4</MenuItem>
              <MenuItem eventKey={2.5}>Another notifications</MenuItem>
            </NavDropdown> */}
            {/* <NavItem eventKey={3} href="#">
              <i className="fa fa-search" />
              <p className="hidden-lg hidden-md">Search</p>
            </NavItem> */}
          </Nav>
          <Nav pullRight>
            
            <NavDropdown
              eventKey={2}
              title={`Hi ${context.role === "ASSESSMENT_ACCT"?"Test Account": toTitleCase(context.role.toLowerCase())}`}
              id="basic-nav-dropdown-right"
            >
              {/* <NavItem onClick={this.context.logout} eventKey={3}>Profile</NavItem> */}
              {/* <NavItem onClick={this.context.logout} eventKey={3}>Settings</NavItem> */}
              {/* <MenuItem divider /> */}
              <NavItem onClick={this.updateRecordFromSheet} eventKey={3}>
                Update Records
              </NavItem>
              <NavItem onClick={this.context.logout} eventKey={3}>Log out</NavItem>
            </NavDropdown>
          </Nav>
        </div>
        )}
      </AuthContext.Consumer>
      
    );
  }
}

export default AdminNavbarLinks;
