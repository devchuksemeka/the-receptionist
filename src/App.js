import React, {Component} from "react";
import { BrowserRouter, Route } from "react-router-dom";
import AdminLayout from "layouts/Admin.jsx";
import DefaultLayout from "layouts/Default";
import { isAuthenticated,getToken,getPermissions,getRole } from "./helpers/auth";

class App extends Component {

  state={
    token:getToken(),
    role:getRole(),
    permissions:getPermissions(),
    isAuth:isAuthenticated()
  }

  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          {/* <Switch> */}
            <Route path="/" render={props => <DefaultLayout {...props} />} />
            <Route path="/admin" render={props => <AdminLayout {...props} />} />
          {/* </Switch> */}
        </React.Fragment>
      </BrowserRouter>
    );
  }
  
}

export default App;
