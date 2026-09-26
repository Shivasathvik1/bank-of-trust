import axios from "axios";


const api = axios.create({

  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8081/api",

  headers: {
    "Content-Type":
      "application/json",
  },

});


/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "trustledger-token"
      );


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) =>
    Promise.reject(error)

);


/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(

  (response) =>
    response,

  (error) => {

    const status =
      error?.response?.status;


    const requestUrl =
      error?.config?.url || "";


    const isAuthRequest =
      requestUrl.includes(
        "/auth/login"
      ) ||
      requestUrl.includes(
        "/auth/register"
      );


    if (
      status === 401 &&
      !isAuthRequest
    ) {

      localStorage.removeItem(
        "trustledger-token"
      );


      sessionStorage.setItem(
        "trustledger-session-message",
        "Your session expired. Please log in again."
      );


      sessionStorage.setItem(
        "trustledger-return-path",
        window.location.pathname
      );


      window.location.replace(
        "/login"
      );

    }


    return Promise.reject(
      error
    );

  }

);


export default api;