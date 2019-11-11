import React from "react";
import { Redirect } from "react-router-dom";
import "./index.scss";
import { loginUser, createUser } from "../../actions/authActions";
import { isAuthenticated } from "../../helpers/auth";

class SetAuth extends React.Component {
  isLogged = false;
  state = {
    currentPage: "login",
    email: "",
    password: "",
    verifyPassword: "",
    error: {},
    loading: false,
    isLogged: false
  };

  onChange = e => {
    const {
      error: { message }
    } = this.state;
    if (message) {
      this.setState({
        error: {}
      });
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitLogin = async e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { history } = this.props;
    const userPayload = {
      email,
      password
    };
    this.setState({ loading: true });
    try {
      await loginUser(userPayload);
      this.setState(
        {
          isLogged: true,
          loading: false
        },
        () => history.push("/overview")
      );
    } catch (error) {
      this.setState({
        error,
        loading: false
      });
    }
  };

  submitSignup = async e => {
    e.preventDefault();
    const { email, password, verifyPassword } = this.state;
    const { history } = this.props;
    const userPayload = {
      email,
      password,
      repeat_password: verifyPassword
    };
    this.setState({ loading: true });
    try {
      await createUser(userPayload);
      this.setState(
        {
          isLogged: true
        },
        () => history.push("/overview")
      );
    } catch (error) {
      this.setState({
        error
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  setScreen(currentPage) {
    this.setState({
      currentPage
    });
  }
  render() {
    const {
      currentPage,
      email,
      password,
      verifyPassword,
      error,
      loading
    } = this.state;

    if (isAuthenticated()) {
      return <Redirect to="/overview" />;
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
                {currentPage === "login"
                  ? "Login to your account"
                  : "Create a new account"}
              </h4>
              <p className="mt-1">Only releaf domains are allowed</p>
              <form
                onSubmit={
                  currentPage === "login" ? this.submitLogin : this.submitSignup
                }
              >
                <input
                  className="user-auth-input"
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  placeholder="email address"
                  required
                />
                <input
                  className="user-auth-input"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.onChange}
                  placeholder="password"
                  required
                />
                {currentPage !== "login" && (
                  <input
                    className="user-auth-input"
                    type="password"
                    name="verifyPassword"
                    value={verifyPassword}
                    onChange={this.onChange}
                    placeholder="confirm password"
                    required
                  />
                )}
                {error.message && (
                  <p className="error-message">{error.message}</p>
                )}
                {currentPage === "login" && (
                  <button type="submit" className="submit-auth-btn">
                    {loading ? "please wait ..." : "Login"}
                  </button>
                )}
                {currentPage === "signUp" && (
                  <button type="submit" className="submit-auth-btn">
                    {loading ? "please wait ..." : "Sign Up"}
                  </button>
                )}
              </form>
              {currentPage === "login" && (
                <p className="small-text">
                  Don't have an account yet?{" "}
                  <button
                    onClick={() => this.setScreen("signUp")}
                    className="bold button-as-link"
                  >
                    signup now
                  </button>
                </p>
              )}

              {currentPage === "signUp" && (
                <p className="small-text">
                  Have an account?{" "}
                  <button
                    onClick={() => this.setScreen("login")}
                    className="bold button-as-link"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SetAuth;
