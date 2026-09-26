import { useMemo, useState } from "react";

import api from "../../api/axios";
import { getApiError } from "../../utils/apiError";

import "./TransactionModal.css";


export default function WithdrawModal({
  accounts,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    accountNumber: "",
    amount: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const activeAccounts = useMemo(() => {
    return accounts.filter(
      (account) =>
        account.status === "ACTIVE"
    );
  }, [accounts]);


  const selectedAccount =
    accounts.find(
      (account) =>
        String(
          account.accountNumber
        ) ===
        String(
          form.accountNumber
        )
    );


  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });

    setError("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.accountNumber) {
      setError(
        "Please select an active account."
      );
      return;
    }

    if (Number(form.amount) <= 0) {
      setError(
        "Withdrawal amount must be greater than zero."
      );
      return;
    }

    if (
      selectedAccount &&
      Number(form.amount) >
      Number(
        selectedAccount.balance
      )
    ) {
      setError(
        "Withdrawal amount cannot exceed your available balance."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post(
        "/transactions/withdraw",
        {
          accountNumber:
            Number(
              form.accountNumber
            ),

          amount:
            Number(
              form.amount
            ),

          description:
            form.description.trim(),
        }
      );

      await onSuccess();
      onClose();

    } catch (error) {
      const apiError =
        getApiError(error);

      setError(
        apiError.message
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="modal-backdrop"
      role="presentation"
    >

      <div
        className="transaction-modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-title"
      >

        <div className="modal-header">

          <h2 id="withdraw-title">
            Withdraw Money
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close withdrawal dialog"
          >
            ×
          </button>

        </div>


        {error && (
          <div
            className="modal-error"
            role="alert"
          >
            {error}
          </div>
        )}


        {activeAccounts.length === 0 ? (

          <div className="modal-no-accounts">

            <strong>
              No active accounts available.
            </strong>

            <p>
              Withdrawal is available
              only for ACTIVE accounts.
            </p>

          </div>

        ) : (

          <form onSubmit={handleSubmit}>

            <label
              htmlFor="withdraw-account"
            >
              Account
            </label>

            <select
              id="withdraw-account"
              className="form-input"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              required
            >

              <option value="">
                Select active account
              </option>


              {accounts.map((account) => (

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

              ))}

            </select>


            {selectedAccount && (
              <div className="modal-balance-info">

                <span>
                  Available Balance
                </span>

                <strong>
                  {formatCurrency(
                    selectedAccount.balance
                  )}
                </strong>

              </div>
            )}


            <label
              htmlFor="withdraw-amount"
            >
              Amount
            </label>

            <input
              id="withdraw-amount"
              className="form-input"
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />


            <label
              htmlFor="withdraw-description"
            >
              Description
            </label>

            <input
              id="withdraw-description"
              className="form-input"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Example: ATM withdrawal"
            />


            <button
              type="submit"
              className="btn btn-primary modal-submit"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Withdraw Money"}
            </button>

          </form>

        )}

      </div>

    </div>
  );
}


function formatCurrency(amount) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(
    Number(amount || 0)
  );
}