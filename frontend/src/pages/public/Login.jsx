import {
  useState,
} from "react";

import {
  BadgeCheck,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api
  from "../../api/axios";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  getApiError,
} from "../../utils/apiError";

import bankOfTrustLogo
  from "../../assets/bank-of-trust-logo.png";

import "./Auth.css";


function decodeJwt(token) {

  try {

    const payload =
      token.split(".")[1];


    let normalized =
      payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");


    while (
      normalized.length % 4
    ) {

      normalized += "=";

    }


    return JSON.parse(
      atob(
        normalized
      )
    );

  } catch (error) {

    console.error(
      "JWT decode error:",
      error
    );

    return null;

  }

}


export default function Login() {

  const navigate =
    useNavigate();


  const {
    login,
  } =
    useAuth();


  const [
    form,
    setForm,
  ] =
    useState({
      email: "",
      password: "",
    });


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const handleChange =
    (event) => {

      setForm({
        ...form,
        [event.target.name]:
          event.target.value,
      });


      setError("");

    };


  const handleSubmit =
    async (event) => {

      event.preventDefault();


      try {

        setLoading(true);

        setError("");


        const response =
          await api.post(
            "/auth/login",
            {
              email:
                form.email.trim(),

              password:
                form.password,
            }
          );


        const token =
          response.data.token;


        if (!token) {

          setError(
            "Login succeeded but no authentication token was received."
          );

          return;

        }


        const payload =
          decodeJwt(token);


        if (!payload) {

          setError(
            "Unable to read the authentication token."
          );

          return;

        }


        login(token);


        const role =
          payload?.role
            ?.replace(
              "ROLE_",
              ""
            )
            ?.toUpperCase();


        if (
          role === "ADMIN"
        ) {

          navigate(
            "/admin",
            {
              replace: true,
            }
          );

          return;

        }


        if (
          role === "CUSTOMER"
        ) {

          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );

          return;

        }


        setError(
          "Your account does not have a recognized role."
        );

      } catch (error) {

        const apiError =
          getApiError(error);


        setError(
          apiError.message ||
          "Login failed."
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="auth-page">


      <div className="auth-container">


        {/* =========================
            BRAND PANEL
        ========================= */}

        <section className="auth-brand-panel">


          <div className="auth-brand-header">


            <div className="auth-brand-logo">

              <img
                src={bankOfTrustLogo}
                alt="Bank of Trust"
              />

            </div>


            <div>

              <h1>
                Bank of Trust
              </h1>

              <span>
                A Brighter Tomorrow
              </span>

            </div>


          </div>



          <div className="auth-brand-message">


            <span className="auth-brand-eyebrow">

              SECURE BANKING

            </span>


            <h2>

              Welcome back to smarter banking.

            </h2>


            <p>

              Securely access your accounts,
              balances, transfers, and
              transaction history from your
              Bank of Trust portal.

            </p>


            <div className="auth-trust-strip">


              <div className="auth-trust-item">

                <ShieldCheck size={15} />

                Secure Access

              </div>


              <div className="auth-trust-item">

                <LockKeyhole size={15} />

                Protected Banking

              </div>


              <div className="auth-trust-item">

                <BadgeCheck size={15} />

                Verified Platform

              </div>


            </div>


          </div>


        </section>



        {/* =========================
            LOGIN FORM
        ========================= */}

        <section className="auth-form-panel">


          <div className="auth-form">


            <h2>

              Sign In

            </h2>


            <p className="muted">

              Access your Bank of Trust
              banking portal.

            </p>



            {error && (

              <div
                className="auth-error"
                role="alert"
              >

                {error}

              </div>

            )}



            <form
              onSubmit={
                handleSubmit
              }
            >


              <label
                htmlFor="login-email"
              >

                Email Address

              </label>


              <input

                id="login-email"

                className="form-input"

                type="email"

                name="email"

                placeholder="you@example.com"

                value={
                  form.email
                }

                onChange={
                  handleChange
                }

                autoComplete="email"

                required

              />



              <label
                htmlFor="login-password"
              >

                Password

              </label>


              <input

                id="login-password"

                className="form-input"

                type="password"

                name="password"

                placeholder="Enter your password"

                value={
                  form.password
                }

                onChange={
                  handleChange
                }

                autoComplete="current-password"

                required

              />



              <button

                type="submit"

                className="btn btn-primary auth-submit"

                disabled={
                  loading
                }

              >

                {loading
                  ? "Signing in..."
                  : "Sign In"}

              </button>


            </form>



            <p className="auth-switch">

              New to Bank of Trust?{" "}

              <Link to="/register">

                Open an account

              </Link>

            </p>


            <Link
              to="/"
              className="auth-home-link"
            >

              ← Back to Bank of Trust

            </Link>


          </div>


        </section>


      </div>


    </div>

  );

}