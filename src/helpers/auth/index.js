import axios from "axios";
import jwtDecode from "jwt-decode";

const auth_data = () =>{
  const store = localStorage.getItem("oat_store")
  if (store) return JSON.parse(store);
  return null;
}

export const getToken = () => {
  const auth = auth_data();
  if(auth) return auth.token;
  return null;
};

export const getRole = () => {
  const auth = auth_data();
  if(auth) return auth.role;
  return null;
};
export const getPermissions = () => {
  const auth = auth_data();
  if(auth) return auth.permissions;
  return [];
};

export const isAuthenticated = () => {
  let isAuthenticated = false;
  const auth = auth_data();
  let token ="";
  if (auth) {
    token = auth.token;
    const decoded = jwtDecode(token);
    if (Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("authToken");
      isAuthenticated = false;
    } else {
      isAuthenticated = true;
      setAuthHeaderToken()
    }
  }
  return isAuthenticated;
};

export const setAuthHeaderToken = () => {
  try {
    const auth = auth_data();
    const idToken = auth.token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
  } catch (err) {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const logOut = history => {
  
  localStorage.removeItem("authToken");
  // return history.location.push("/");
  // return window.location.replace("/");
};
