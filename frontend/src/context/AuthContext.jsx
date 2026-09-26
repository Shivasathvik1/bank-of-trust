import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


const AuthContext =
  createContext(null);


/* =========================
   DECODE JWT
========================= */

function decodeJwt(token) {

  try {

    if (!token) {
      return null;
    }


    const parts =
      token.split(".");


    if (parts.length !== 3) {
      return null;
    }


    let payload =
      parts[1];


    payload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");


    while (
      payload.length % 4
    ) {

      payload += "=";

    }


    const decoded =
      atob(payload);


    const jsonPayload =
      decodeURIComponent(

        decoded
          .split("")
          .map(
            (char) =>
              "%" +
              (
                "00" +
                char
                  .charCodeAt(0)
                  .toString(16)
              ).slice(-2)
          )
          .join("")

      );


    return JSON.parse(
      jsonPayload
    );

  } catch (error) {

    console.error(
      "Unable to decode JWT:",
      error
    );


    return null;

  }

}


/* =========================
   CHECK EXPIRATION
========================= */

function isTokenExpired(
  payload
) {

  if (!payload) {
    return true;
  }


  if (!payload.exp) {
    return true;
  }


  const currentTime =
    Math.floor(
      Date.now() / 1000
    );


  return (
    payload.exp <=
    currentTime
  );

}


/* =========================
   NORMALIZE ROLE
========================= */

function normalizeRole(role) {

  if (!role) {
    return null;
  }


  return role
    .toUpperCase()
    .replace(
      "ROLE_",
      ""
    );

}


/* =========================
   AUTH PROVIDER
========================= */

export function AuthProvider({
  children,
}) {

  const [
    token,
    setToken,
  ] =
    useState(() =>
      localStorage.getItem(
        "trustledger-token"
      )
    );


  const payload =
    useMemo(

      () =>
        decodeJwt(token),

      [token]

    );


  const expired =
    useMemo(

      () =>
        isTokenExpired(
          payload
        ),

      [payload]

    );


  const role =
    normalizeRole(
      payload?.role
    );


  const email =
    payload?.sub || null;


  const isAuthenticated =
    Boolean(
      token &&
      payload &&
      !expired
    );


  /* =========================
     LOGIN
  ========================= */

  const login = (
    newToken
  ) => {

    localStorage.setItem(
      "trustledger-token",
      newToken
    );


    setToken(
      newToken
    );

  };


  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {

    localStorage.removeItem(
      "trustledger-token"
    );


    setToken(null);

  };


  /* =========================
     REMOVE INVALID TOKEN
  ========================= */

  useEffect(() => {

    if (
      token &&
      (
        !payload ||
        expired
      )
    ) {

      localStorage.removeItem(
        "trustledger-token"
      );


      setToken(null);

    }

  }, [
    token,
    payload,
    expired,
  ]);


  /* =========================
     AUTO LOGOUT
  ========================= */

  useEffect(() => {

    if (
      !token ||
      !payload?.exp ||
      expired
    ) {

      return;

    }


    const expirationTime =
      payload.exp * 1000;


    const timeRemaining =
      expirationTime -
      Date.now();


    if (
      timeRemaining <= 0
    ) {

      logout();

      return;

    }


    const timer =
      setTimeout(() => {

        sessionStorage.setItem(

          "trustledger-session-message",

          "Your session expired. Please log in again."

        );


        if (
          window.location.pathname !==
          "/login"
        ) {

          sessionStorage.setItem(
            "trustledger-return-path",
            window.location.pathname
          );

        }


        logout();


        if (
          window.location.pathname !==
          "/login"
        ) {

          window.location.replace(
            "/login"
          );

        }

      }, timeRemaining);


    return () => {

      clearTimeout(
        timer
      );

    };

  }, [
    token,
    payload,
    expired,
  ]);


  return (

    <AuthContext.Provider

      value={{
        token,
        role,
        email,
        isAuthenticated,
        login,
        logout,
      }}

    >

      {children}

    </AuthContext.Provider>

  );

}


/* =========================
   USE AUTH
========================= */

export function useAuth() {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

}