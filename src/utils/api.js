import axios from "axios";

//const LOCAL_BACKEND = `${process.env.REACT_APP_LOCAL_BACKEND}/api`;
const PROD_BACKEND = `${process.env.REACT_APP_PROD_BACKEND}/api`;
const BACKEND_PROXY = `${process.env.REACT_APP_BACKEND_PROXY}/api`;

const api = axios.create({
  baseURL: BACKEND_PROXY,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});

api.interceptors.request.use(
  (request) => {
    request.headers.authorization = `Bearer ${sessionStorage.getItem("token")}`;
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error =
      error.response.data.error || error.response.data.message || error.message;
    return Promise.reject(error);
  }
);

export default api;
