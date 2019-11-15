import React, { Component } from 'react'
import axios from 'axios';

import AuthContext from '../../context/AuthContext'
import Loader from "../../common/Loader";

import './Auth.scss'

export default class Auth extends Component{
    state = {
        isLogin:true,
        error:{
            message:null
        },
        loading:false,
        baseURL:process.env.REACT_APP_SERVER_ENDPOINT
    }

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEL = React.createRef();
        this.verifyPasswordEL = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}
        })
    }

    submitFormHandler =  async (event) =>{
        event.preventDefault();
        let formData = {
            email:this.emailEl.current.value,
            password:this.passwordEL.current.value
        }
        this.setState({
            error:{
                message:null
            },
            loading:true
        });
        
        if(this.state.isLogin){
            
            if(formData.email.trim().length === 0 || formData.password.trim().length === 0){
                this.setState({
                    error:{
                        message:"Email and password are both required"
                    },
                    loading:false
                });
                return;
                
            }else{
                try {
                    const response = await axios.post(`${this.state.baseURL}/v1/user/login`, formData);
                    this.setState({
                        loading:false
                    });

                    this.context.login(
                        response.data.authToken,
                        response.data.role,
                    )

                  } catch (error) {
                    if(!error.response) return;
                    this.setState({
                        error:{
                            message:error.response.data.message
                        },
                        loading:false
                    });
                  }
            }
        }else{
            formData = {
                ...formData,
                repeat_password:this.verifyPasswordEL.current.value
            }
            if(formData.email.trim().length === 0 || 
                formData.password.trim().length === 0 || 
                formData.repeat_password.trim().length === 0){
                this.setState({
                    error:{
                        message:"Email, password and confirm password are required"
                    },
                    loading:false
                });
                return;
            }else{
                if(formData.password !== formData.repeat_password){
                    this.setState({
                        error:{
                            message:"Confirm password must match password"
                        },
                        loading:false
                    });
                    return;
                }
                try {
                    const response = await axios.post(`${this.state.baseURL}/v1/user/signup`, formData);
                    console.log(response);
                    this.setState({
                        loading:false
                    });
                    this.context.login(
                        response.data.authToken,
                        response.data.role,
                    )
                  } catch (error) {
                      if(!error.response) return;
                    this.setState({
                        error:{
                            message:error.response.data.message
                        },
                        loading:false
                    });
                  }
            }
            
        }
    }

    render(){
        const submitBtnText = () =>{
            if(this.state.isLogin) return "Login";
            return "Sign Up";
        }
        return (
            <div className="App">
                <div className="flex-container">
                <div className="flex-item-1">
                    <header className="app-header">
                    Welcome to FOT
                    <button className="get-started-button" />
                    </header>
                </div>
                <div className="flex-item-2">
                    <div className="auth-form-container">
                    <h4 className="mb-0">
                        {this.state.isLogin
                        ? "Login to your account"
                        : "Create a new account"}
                    </h4>
                    <p className="mt-1">Only releaf domains are allowed</p>
                    <form className="form-horizontal" onSubmit={this.submitFormHandler} >
                        <div className="form-row">
                            <div className="form-group col-md-8 col-xs-10">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="exampleInputEmail1" 
                                    ref={this.emailEl}
                                    aria-describedby="emailHelp" 
                                    placeholder="Enter email">
                                    </input>
                            </div>
                            <div className="form-group col-md-8 col-xs-10">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="exampleInputPassword1" 
                                    ref={this.passwordEL}
                                    placeholder="Password"></input>
                            </div>
                        {!this.state.isLogin && (
                        <div className="form-group col-md-8 col-xs-10">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="exampleInputPassword1" 
                                ref={this.verifyPasswordEL}
                                placeholder="Confirm Password"></input>
                        </div>
                         )}
                        {this.state.error.message &&  (<div className="form-group col-md-8 col-xs-10">
                            <small 
                                id="emailHelp" 
                                className="form-text text-muted"
                                style={{color:"red"}}>
                                   {this.state.error.message}
                            </small>
                        </div>
                        )}
                        
                            <div className="form-group col-md-8 col-xs-10">
                                <button type="submit" className="btn btn-secondary" >{this.state.isLogin ? "Login" : "Sign Up"} {this.state.loading ? "..." : ""}</button>
                            </div>
                        </div>
                            
                        </form>
                        <div className="row">
                            <div className="col-md-8 col-xs-10">
                            {this.state.isLogin && (
                                    <p className="small-text">
                                    Don't have an account yet?{" "}
                                    <button
                                        onClick={this.switchModeHandler}
                                        className="btn btn-primary btn-xs"
                                    >
                                        signup now
                                    </button>
                                    </p>
                                )}

                                {!this.state.isLogin && (
                                    <p className="small-text">
                                    Have an account?{" "}
                                    <button
                                        onClick={this.switchModeHandler}
                                        className="btn btn-primary btn-xs"
                                    >
                                        Login
                                    </button>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
} 
