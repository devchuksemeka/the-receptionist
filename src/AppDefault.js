import React, {Component} from "react";

import { BrowserRouter, Route } from "react-router-dom";

import AdminLayout from "layouts/Admin.jsx";
import AuthContext from './context/AuthContext'
import AuthPage from './pages/Auth/Auth'

import { setAuthHeaderToken,isAuthenticated,getToken,getPermissions,getRole } from "./helpers/auth";

class App extends Component {
  state={
    token:getToken(),
    role:getRole(),
    permissions:getPermissions(),
    isAuth:isAuthenticated()
  }
  login = (data) => {
    let {permissions,role,token} = data
    localStorage.setItem("oat_store",JSON.stringify(data));
    setAuthHeaderToken();
    this.setState({
       token,
       role,
       permissions,
       isAuth:true
     })
  }

  logout = (props) => {
    this.setState({
      token:null,
      role:null,
      permissions:[],
      isAuth:false
    })
    localStorage.removeItem("oat_store");
  }
  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{
            token:this.state.token,
            role:this.state.role,
            permissions:this.state.permissions,
            login:this.login,
            logout:this.logout,
            isAuth:this.state.isAuth
          }}>
             {!this.state.isAuth &&  <Route path="/" component={AuthPage} />}
             {this.state.isAuth && <Route path="/" render={props => <AdminLayout {...props} />} />}
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
  
}

export default App;
