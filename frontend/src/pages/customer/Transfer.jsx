import { useEffect, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Send,
  WalletCards,
} from "lucide-react";

import api from "../../api/axios";

import {
  getApiError,
} from "../../utils/apiError";

import "./Transfer.css";


export default function Transfer() {

  const [
    accounts,
    setAccounts,
  ] =
    useState([]);


  const [
    form,
    setForm,
  ] =
    useState({
      senderAccountNumber: "",
      receiverAccountNumber: "",
      amount: "",
      description: "",
    });


  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState({});


  const [
    loadingAccounts,
    setLoadingAccounts,
  ] =
    useState(true);


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);


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


  useEffect(() => {

    loadAccounts();

  }, []);


  const loadAccounts =
    async () => {

      try {

        setLoadingAccounts(true);

        setError("");


        const response =
          await api.get(
            "/customers/me/accounts"
          );


        setAccounts(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );

      } catch (error) {

        const apiError =
          getApiError(error);


        setError(
          apiError.message ||
          "Unable to load your accounts"
        );

      } finally {

        setLoadingAccounts(false);

      }

    };


  const handleChange =
    (event) => {

      const {
        name,
        value,
      } =
        event.target;


      setForm(
        (currentForm) => ({
          ...currentForm,
          [name]: value,
        })
      );


      setFieldErrors(
        (currentErrors) => ({
          ...currentErrors,
          [name]: "",
        })
      );


      setError("");

      setSuccess("");

    };


  const handleSubmit =
    async (event) => {

      event.preventDefault();


      setError("");

      setSuccess("");

      setFieldErrors({});


      /*
       * Basic frontend validation
       */
      if (
        !form.senderAccountNumber ||
        !form.receiverAccountNumber ||
        !form.amount
      ) {

        setError(
          "Please complete all required fields"
        );

        return;

      }


      /*
       * Receiver account must be positive.
       */
      if (
        Number(
          form.receiverAccountNumber
        ) <= 0
      ) {

        setFieldErrors({
          receiverAccountNumber:
            "Receiver account number must be greater than zero",
        });

        setError(
          "Please correct the highlighted fields."
        );

        return;

      }


      /*
       * Sender and receiver
       * cannot be the same account.
       */
      if (
        Number(
          form.senderAccountNumber
        ) ===
        Number(
          form.receiverAccountNumber
        )
      ) {

        setFieldErrors({
          receiverAccountNumber:
            "Sender and receiver accounts cannot be the same",
        });

        setError(
          "Sender and receiver accounts cannot be the same"
        );

        return;

      }


      /*
       * Amount must be positive.
       */
      if (
        Number(form.amount) <= 0
      ) {

        setFieldErrors({
          amount:
            "Transfer amount must be greater than zero",
        });

        setError(
          "Transfer amount must be greater than zero"
        );

        return;

      }


      /*
       * Maximum two decimal places.
       *
       * This matches the backend
       * monetary precision rule.
       */
      if (
        !/^\d+(\.\d{1,2})?$/.test(
          form.amount
        )
      ) {

        setFieldErrors({
          amount:
            "Amount can have at most 2 decimal places",
        });

        setError(
          "Please enter a valid transfer amount"
        );

        return;

      }


      try {

        setSubmitting(true);


        await api.post(
          "/transactions/transfer",
          {

            senderAccountNumber:
              Number(
                form.senderAccountNumber
              ),

            receiverAccountNumber:
              Number(
                form.receiverAccountNumber
              ),

            amount:
              Number(
                form.amount
              ),

            description:
              form.description.trim(),

          }
        );


        setSuccess(
          "Transfer completed successfully"
        );


        setForm({
          senderAccountNumber: "",
          receiverAccountNumber: "",
          amount: "",
          description: "",
        });


        setFieldErrors({});


        await loadAccounts();

      } catch (error) {

        /*
         * Important:
         *
         * Never store error.response.data
         * directly in React state.
         *
         * It may be an object.
         */
        const apiError =
          getApiError(error);


        setError(
          apiError.message ||
          "Transfer failed"
        );


        setFieldErrors(
          apiError.fieldErrors || {}
        );

      } finally {

        setSubmitting(false);

      }

    };


  const selectedAccount =
    accounts.find(
      (account) =>
        String(
          account.accountNumber
        ) ===
        String(
          form.senderAccountNumber
        )
    );


  if (loadingAccounts) {

    return (

      <div className="transfer-loading card">

        Loading accounts...

      </div>

    );

  }


  return (

    <div className="transfer-page">


      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="transfer-heading">

        <div>

          <p className="transfer-eyebrow">

            Money Transfer

          </p>


          <h1>

            Transfer Money

          </h1>


          <p className="muted">

            Send money securely from
            one of your Bank of Trust
            accounts.

          </p>

        </div>

      </div>



      {/* =========================
          MAIN LAYOUT
      ========================= */}

      <div className="transfer-layout">


        {/* =========================
            TRANSFER FORM
        ========================= */}

        <div className="transfer-form-card card">


          <div className="transfer-card-header">


            <div className="transfer-header-icon">

              <Send size={22} />

            </div>


            <div>

              <h2>

                Transfer Details

              </h2>


              <p className="muted">

                Enter the receiving
                account and amount.

              </p>

            </div>

          </div>



          {/* =========================
              ERROR MESSAGE
          ========================= */}

          {error && (

            <div
              className="transfer-message transfer-error"
              role="alert"
            >

              {error}

            </div>

          )}



          {/* =========================
              SUCCESS MESSAGE
          ========================= */}

          {success && (

            <div
              className="transfer-message transfer-success"
              role="status"
            >

              <CheckCircle2
                size={19}
              />

              {success}

            </div>

          )}



          <form
            onSubmit={handleSubmit}
            className="transfer-form"
          >


            {/* =========================
                FROM ACCOUNT
            ========================= */}

            <label
              htmlFor="senderAccountNumber"
            >

              From Account

            </label>


            <select
              id="senderAccountNumber"
              className="form-input"
              name="senderAccountNumber"
              value={
                form.senderAccountNumber
              }
              onChange={
                handleChange
              }
              required
            >

              <option value="">

                Select your account

              </option>


              {accounts.map(
                (account) => (

                  <option
                    key={
                      account.accountNumber
                    }
                    value={
                      account.accountNumber
                    }
                    disabled={
                      account.status !==
                      "ACTIVE"
                    }
                  >

                    {account.accountType}

                    {" - "}

                    {account.accountNumber}

                    {" - "}

                    {formatCurrency(
                      account.balance
                    )}

                    {account.status !==
                    "ACTIVE"
                      ? ` (${account.status})`
                      : ""}

                  </option>

                )
              )}

            </select>



            {selectedAccount && (

              <div className="selected-account-info">

                <WalletCards
                  size={18}
                />


                <div>

                  <span className="muted">

                    Available balance

                  </span>


                  <strong>

                    {formatCurrency(
                      selectedAccount.balance
                    )}

                  </strong>

                </div>

              </div>

            )}



            {/* =========================
                RECEIVER ACCOUNT
            ========================= */}

            <label
              htmlFor="receiverAccountNumber"
            >

              Receiver Account Number

            </label>


            <input
              id="receiverAccountNumber"
              className={`form-input ${
                fieldErrors
                  .receiverAccountNumber
                  ? "input-error"
                  : ""
              }`}
              type="number"
              name="receiverAccountNumber"
              min="1"
              step="1"
              value={
                form.receiverAccountNumber
              }
              onChange={
                handleChange
              }
              placeholder="Enter receiver account number"
              required
              aria-invalid={
                Boolean(
                  fieldErrors
                    .receiverAccountNumber
                )
              }
            />


            {fieldErrors
              .receiverAccountNumber && (

              <span className="field-error-message">

                {
                  fieldErrors
                    .receiverAccountNumber
                }

              </span>

            )}



            {/* =========================
                AMOUNT
            ========================= */}

            <label
              htmlFor="transferAmount"
            >

              Amount

            </label>


            <div className="amount-input-wrapper">

              <span>

                $

              </span>


              <input
                id="transferAmount"
                className={`form-input amount-input ${
                  fieldErrors.amount
                    ? "input-error"
                    : ""
                }`}
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                value={
                  form.amount
                }
                onChange={
                  handleChange
                }
                placeholder="0.00"
                required
                aria-invalid={
                  Boolean(
                    fieldErrors.amount
                  )
                }
              />

            </div>


            {fieldErrors.amount && (

              <span className="field-error-message">

                {fieldErrors.amount}

              </span>

            )}



            {/* =========================
                DESCRIPTION
            ========================= */}

            <label
              htmlFor="transferDescription"
            >

              Description

              <span className="optional-label">

                Optional

              </span>

            </label>


            <textarea
              id="transferDescription"
              className={`form-input transfer-description ${
                fieldErrors.description
                  ? "input-error"
                  : ""
              }`}
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              placeholder="Example: Rent, payment to friend..."
              rows="3"
              maxLength={255}
            />


            {fieldErrors.description && (

              <span className="field-error-message">

                {fieldErrors.description}

              </span>

            )}



            {/* =========================
                SUBMIT
            ========================= */}

            <button
              className="btn btn-primary transfer-submit"
              type="submit"
              disabled={
                submitting ||
                accounts.length === 0
              }
            >

              {submitting
                ? "Processing..."
                : "Transfer Money"}


              {!submitting && (

                <ArrowRight
                  size={18}
                />

              )}

            </button>

          </form>

        </div>



        {/* =========================
            TRANSFER SUMMARY
        ========================= */}

        <aside className="transfer-summary card">


          <h3>

            Transfer Summary

          </h3>



          <div className="summary-row">

            <span className="muted">

              From

            </span>


            <strong>

              {selectedAccount
                ? `${selectedAccount.accountType} ••••${String(
                    selectedAccount.accountNumber
                  ).slice(-4)}`
                : "—"}

            </strong>

          </div>



          <div className="summary-row">

            <span className="muted">

              To account

            </span>


            <strong>

              {form.receiverAccountNumber ||
                "—"}

            </strong>

          </div>



          <div className="summary-row">

            <span className="muted">

              Amount

            </span>


            <strong className="summary-amount">

              {formatCurrency(
                form.amount
              )}

            </strong>

          </div>



          <div className="summary-divider" />



          <div className="summary-note">

            <CheckCircle2
              size={18}
            />


            <p>

              Transfers are validated by
              the backend before funds are
              moved.

            </p>

          </div>

        </aside>

      </div>

    </div>

  );

}



function formatCurrency(
  amount
) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(
    Number(
      amount || 0
    )
  );

}