import axios from "axios";
// import jwtDecode from "jwt-decode";

export const isAuthenticated = () => {
  let isAuthenticated = false;
  const token = localStorage.getItem("authToken");
  console.log(`token is ${token}`)
  if (token) {
    isAuthenticated =  true;
    // const decoded = jwtDecode(token);
    // if (Date.now() >= decoded.exp * 1000) {
    //   isAuthenticated = false;
    // } else {
    //   isAuthenticated = true;
    // }
  }
  return isAuthenticated;
};

export const setAuthHeaderToken = () => {
  try {
    const idToken = localStorage.getItem("authToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
  } catch (err) {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const logOut = history => {
  localStorage.removeItem("authToken");
  // history.location.push("/");
  // return window.location.replace("/");
};
