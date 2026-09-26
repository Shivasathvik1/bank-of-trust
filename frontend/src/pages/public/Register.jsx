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
  getApiError,
} from "../../utils/apiError";

import bankOfTrustLogo
  from "../../assets/bank-of-trust-logo.png";

import "./Auth.css";


export default function Register() {

  const navigate =
    useNavigate();


  const [
    form,
    setForm,
  ] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
    });


  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState({});


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    success,
    setSuccess,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const handleChange =
    (event) => {

      const {
        name,
        value,
      } =
        event.target;


      setForm({
        ...form,
        [name]: value,
      });


      setFieldErrors(
        (current) => ({
          ...current,
          [name]: "",
        })
      );


      setError("");

    };


  const handleSubmit =
    async (event) => {

      event.preventDefault();


      try {

        setLoading(true);

        setError("");

        setSuccess("");

        setFieldErrors({});


        await api.post(
          "/auth/register",
          {
            firstName:
              form.firstName.trim(),

            lastName:
              form.lastName.trim(),

            email:
              form.email.trim(),

            phoneNumber:
              form.phoneNumber.trim(),

            address:
              form.address.trim(),

            password:
              form.password,
          }
        );


        setSuccess(
          "Your Bank of Trust account has been created. Redirecting to login..."
        );


        setTimeout(
          () => {

            navigate(
              "/login"
            );

          },
          1000
        );

      } catch (error) {

        const apiError =
          getApiError(error);


        setError(
          apiError.message
        );


        setFieldErrors(
          apiError.fieldErrors
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

              DIGITAL BANKING

            </span>


            <h2>

              Banking built around you.

            </h2>


            <p>

              Create your Bank of Trust
              profile and securely manage
              accounts, transactions,
              deposits, withdrawals, and
              transfers.

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
            REGISTER FORM
        ========================= */}

        <section className="auth-form-panel">


          <div className="auth-form">


            <h2>

              Open an Account

            </h2>


            <p className="muted">

              Enter your personal
              information below.

            </p>



            {error && (

              <div
                className="auth-error"
                role="alert"
              >

                {error}

              </div>

            )}



            {success && (

              <div
                className="auth-success"
                role="status"
              >

                {success}

              </div>

            )}



            <form
              onSubmit={handleSubmit}
              noValidate
            >


              <div className="form-row">


                <div>

                  <label
                    htmlFor="firstName"
                  >

                    First Name

                  </label>


                  <input

                    id="firstName"

                    className={`form-input ${
                      fieldErrors.firstName
                        ? "input-error"
                        : ""
                    }`}

                    type="text"

                    name="firstName"

                    value={
                      form.firstName
                    }

                    onChange={
                      handleChange
                    }

                    autoComplete="given-name"

                    required

                  />


                  {fieldErrors.firstName && (

                    <FieldError
                      message={
                        fieldErrors.firstName
                      }
                    />

                  )}


                </div>



                <div>

                  <label
                    htmlFor="lastName"
                  >

                    Last Name

                  </label>


                  <input

                    id="lastName"

                    className={`form-input ${
                      fieldErrors.lastName
                        ? "input-error"
                        : ""
                    }`}

                    type="text"

                    name="lastName"

                    value={
                      form.lastName
                    }

                    onChange={
                      handleChange
                    }

                    autoComplete="family-name"

                    required

                  />


                  {fieldErrors.lastName && (

                    <FieldError
                      message={
                        fieldErrors.lastName
                      }
                    />

                  )}


                </div>


              </div>



              <label
                htmlFor="email"
              >

                Email

              </label>


              <input

                id="email"

                className={`form-input ${
                  fieldErrors.email
                    ? "input-error"
                    : ""
                }`}

                type="email"

                name="email"

                value={
                  form.email
                }

                onChange={
                  handleChange
                }

                autoComplete="email"

                required

              />


              {fieldErrors.email && (

                <FieldError
                  message={
                    fieldErrors.email
                  }
                />

              )}



              <label
                htmlFor="phoneNumber"
              >

                Phone Number

              </label>


              <input

                id="phoneNumber"

                className={`form-input ${
                  fieldErrors.phoneNumber
                    ? "input-error"
                    : ""
                }`}

                type="tel"

                name="phoneNumber"

                value={
                  form.phoneNumber
                }

                onChange={
                  handleChange
                }

                autoComplete="tel"

                inputMode="tel"

                required

              />


              {fieldErrors.phoneNumber && (

                <FieldError
                  message={
                    fieldErrors.phoneNumber
                  }
                />

              )}



              <label
                htmlFor="address"
              >

                Address

              </label>


              <input

                id="address"

                className={`form-input ${
                  fieldErrors.address
                    ? "input-error"
                    : ""
                }`}

                type="text"

                name="address"

                value={
                  form.address
                }

                onChange={
                  handleChange
                }

                autoComplete="street-address"

                required

              />


              {fieldErrors.address && (

                <FieldError
                  message={
                    fieldErrors.address
                  }
                />

              )}



              <label
                htmlFor="password"
              >

                Password

              </label>


              <input

                id="password"

                className={`form-input ${
                  fieldErrors.password
                    ? "input-error"
                    : ""
                }`}

                type="password"

                name="password"

                value={
                  form.password
                }

                onChange={
                  handleChange
                }

                autoComplete="new-password"

                required

              />


              <small className="auth-help-text">

                Use a secure password that
                meets the account
                requirements.

              </small>


              {fieldErrors.password && (

                <FieldError
                  message={
                    fieldErrors.password
                  }
                />

              )}



              <button

                className="btn btn-primary auth-submit"

                type="submit"

                disabled={
                  loading
                }

              >

                {loading
                  ? "Creating account..."
                  : "Open Account"}

              </button>


            </form>



            <p className="auth-switch">

              Already have an account?{" "}

              <Link to="/login">

                Sign in

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


function FieldError({
  message,
}) {

  return (

    <span
      className="field-error-message"
      role="alert"
    >

      {message}

    </span>

  );

}