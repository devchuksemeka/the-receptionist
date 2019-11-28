import React, {Component} from "react";

import { BrowserRouter, Route } from "react-router-dom";

import AdminLayout from "layouts/Admin.jsx";
import AuthContext from './context/AuthContext'
import AuthPage from './pages/Auth/Auth'

import { setAuthHeaderToken,isAuthenticated } from "./helpers/auth";

class App extends Component {
  state={
    token:null,
    role:null,
    isAuth:isAuthenticated()
  }
  login = (token,role) => {
    localStorage.setItem("authToken",token);
    setAuthHeaderToken();
    this.setState({
       token,
       role,
       isAuth:true
     })
  }

  logout = (props) => {
    this.setState({
      token:null,
      role:null,
      isAuth:false
    })
    localStorage.removeItem("authToken");
  }
  render(){
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{
            token:this.state.token,
            role:this.state.role,
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
