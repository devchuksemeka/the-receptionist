import axios from "axios";
import { setAuthToken } from "../helpers/auth";

const baseUrl = process.env.REACT_APP_SERVER_ENDPOINT;

export const loginUser = async payload => {
  try {
    const user = await axios.post(`${baseUrl}/v1/user/login`, payload);
    localStorage.setItem("authToken", user.data.authToken);
    setAuthToken();
  } catch (error) {
    const errorMessage =
      error.response.data.error || error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const createUser = async payload => {
  try {
    const user = await axios.post(`${baseUrl}/v1/user/signup`, payload);
    localStorage.setItem("authToken", user.data.authToken);
    setAuthToken();
  } catch (error) {
    const errorMessage =
      error.response.data.error || error.response.data.message;
    throw new Error(errorMessage);
  }
};
