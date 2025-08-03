import axios from "axios";

const LOCAL_BACKEND = `${process.env.REACT_APP_LOCAL_BACKEND}/api`;
const PROD_BACKEND = `${process.env.REACT_APP_PROD_BACKEND}/api`;
const BACKEND_PROXY = `${process.env.REACT_APP_BACKEND_PROXY}/api`;
// console.log("proxy", BACKEND_PROXY);

// Use production backend if available, otherwise use local
const baseURL = PROD_BACKEND || LOCAL_BACKEND;

const api = axios.create({
  baseURL: BACKEND_PROXY,
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response Success:", response);
    return response;
  },
  function (error) {
    console.log("RESPONSE ERROR", error);
    console.log("Error Response:", error.response);
    console.log("Error Message:", error.message);
    return Promise.reject(error);
  }
);

export default api;
