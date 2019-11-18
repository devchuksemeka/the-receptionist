import axios from "axios";

const baseUrl = process.env.REACT_APP_SERVER_ENDPOINT;

export const getP2Inventory = async (startDate, endDate, graphView,currency) => {
  try {
    const res = await axios.get(
      `${baseUrl}/v1/p2info?startDate=${startDate}&endDate=${endDate}&graphView=${graphView}&currency=${currency}`
    );
    return res.data;
  } catch (error) {
    const errorMessage =
      error.response.data.error || error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const getPkoInventory = async (startDate, endDate, graphView,currency) => {
  try {
    const res = await axios.get(
      `${baseUrl}/v1/pkoinfo?startDate=${startDate}&endDate=${endDate}&graphView=${graphView}&currency=${currency}`
    );
    return res.data;
  } catch (error) {
    const errorMessage =
      error.response.data.error || error.response.data.message;
    throw new Error(errorMessage);
  }
};

export const getPkcInventory = async (startDate, endDate, graphView,currency) => {
  try {
    const res = await axios.get(
      `${baseUrl}/v1/pkcinfo?startDate=${startDate}&endDate=${endDate}&graphView=${graphView}&currency=${currency}`
    );
    return res.data;
  } catch (error) {
    const errorMessage =
      error.response.data.error || error.response.data.message;
    throw new Error(errorMessage);
  }
};
