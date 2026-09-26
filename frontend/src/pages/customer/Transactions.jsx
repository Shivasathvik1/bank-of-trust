import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
} from "lucide-react";

import api from "../../api/axios";
import "./Transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [reference, setReference] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  useEffect(() => {
    loadTransactions();
  }, [page, type, fromDate, toDate]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        size,
      };

      if (type) {
        params.type = type;
      }

      if (fromDate) {
        params.from =
          `${fromDate}T00:00:00`;
      }

      if (toDate) {
        params.to =
          `${toDate}T23:59:59`;
      }

      const response = await api.get(
        "/transactions/my",
        {
          params,
        }
      );

      setTransactions(
        response.data?.content || []
      );

      setTotalPages(
        response.data?.totalPages || 0
      );

      setTotalElements(
        response.data?.totalElements || 0
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to load transactions"
      );

    } finally {
      setLoading(false);
    }
  };


  const handleReferenceSearch =
    async (event) => {

      event.preventDefault();

      if (!reference.trim()) {
        return;
      }

      try {
        setError("");

        const response =
          await api.get(
            `/transactions/reference/${reference.trim()}`
          );

        setSelectedTransaction(
          response.data
        );

      } catch (error) {

        setSelectedTransaction(null);

        setError(
          error.response?.data?.message ||
          error.response?.data ||
          "Transaction not found"
        );
      }
    };


  const handleTypeChange = (
    event
  ) => {
    setType(event.target.value);
    setPage(0);
  };


  const handleFromDate = (
    event
  ) => {
    setFromDate(
      event.target.value
    );

    setPage(0);
  };


  const handleToDate = (
    event
  ) => {
    setToDate(
      event.target.value
    );

    setPage(0);
  };


  const clearFilters = () => {
    setType("");
    setFromDate("");
    setToDate("");
    setPage(0);
  };


  return (
    <div className="transactions-page">

      <section className="transactions-heading">

        <div>

          <p className="transactions-eyebrow">
            Activity
          </p>

          <h1>
            Transactions
          </h1>

          <p className="muted">
            View and filter your
            Bank of Trust transaction history.
          </p>

        </div>

      </section>


      <section className="transaction-filters card">

        <form
          className="reference-search"
          onSubmit={
            handleReferenceSearch
          }
        >

          <Search size={18} />

          <input
            type="text"
            value={reference}
            onChange={(event) =>
              setReference(
                event.target.value
              )
            }
            placeholder="Search transaction reference"
          />

          <button
            className="btn btn-primary"
            type="submit"
          >
            Search
          </button>

        </form>


        <div className="filter-grid">

          <div>

            <label>
              Transaction Type
            </label>

            <select
              className="form-input"
              value={type}
              onChange={
                handleTypeChange
              }
            >

              <option value="">
                All Types
              </option>

              <option value="TRANSFER">
                Transfer
              </option>

              <option value="DEPOSIT">
                Deposit
              </option>

              <option value="WITHDRAWAL">
                Withdrawal
              </option>

            </select>

          </div>


          <div>

            <label>
              From
            </label>

            <input
              className="form-input"
              type="date"
              value={fromDate}
              onChange={
                handleFromDate
              }
            />

          </div>


          <div>

            <label>
              To
            </label>

            <input
              className="form-input"
              type="date"
              value={toDate}
              onChange={
                handleToDate
              }
            />

          </div>


          <div className="filter-clear-wrapper">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>

          </div>

        </div>

      </section>


      {error && (
        <div className="transactions-error">
          {error}
        </div>
      )}


      <section className="transactions-table-card card">

        <div className="transactions-table-header">

          <div>

            <h2>
              Transaction History
            </h2>

            <p className="muted">
              {totalElements} transaction
              {totalElements === 1
                ? ""
                : "s"}
            </p>

          </div>

        </div>


        {loading ? (

          <div className="transactions-loading">
            Loading transactions...
          </div>

        ) : transactions.length === 0 ? (

          <div className="transactions-empty">
            No transactions found.
          </div>

        ) : (

          <div className="transactions-table-wrapper">

            <table className="transactions-table">

              <thead>

                <tr>

                  <th>
                    Date
                  </th>

                  <th>
                    Reference
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Account
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {transactions.map(
                  (transaction) => (

                    <TransactionTableRow
                      key={
                        transaction
                          .transactionReference
                      }
                      transaction={
                        transaction
                      }
                      onClick={() =>
                        setSelectedTransaction(
                          transaction
                        )
                      }
                    />

                  )
                )}

              </tbody>

            </table>

          </div>

        )}


        <div className="transactions-pagination">

          <button
            className="btn btn-secondary"
            disabled={page === 0}
            onClick={() =>
              setPage(
                (current) =>
                  current - 1
              )
            }
          >
            Previous
          </button>


          <span>
            Page{" "}
            {totalPages === 0
              ? 0
              : page + 1}
            {" of "}
            {totalPages}
          </span>


          <button
            className="btn btn-secondary"
            disabled={
              totalPages === 0 ||
              page + 1 >=
                totalPages
            }
            onClick={() =>
              setPage(
                (current) =>
                  current + 1
              )
            }
          >
            Next
          </button>

        </div>

      </section>


      {selectedTransaction && (

        <TransactionDetailsModal
          transaction={
            selectedTransaction
          }
          onClose={() =>
            setSelectedTransaction(
              null
            )
          }
        />

      )}

    </div>
  );
}


function TransactionTableRow({
  transaction,
  onClick,
}) {

  const isCredit =
    transaction.direction ===
    "CREDIT";

  const accountNumber =
    isCredit
      ? transaction
          .receiverAccountNumber
      : transaction
          .senderAccountNumber;

  return (
    <tr
      onClick={onClick}
      className="transaction-table-row"
    >

      <td>
        {formatDate(
          transaction
            .transactionDateTime
        )}
      </td>


      <td className="reference-cell">
        {
          transaction
            .transactionReference
        }
      </td>


      <td>

        <span
          className={`type-badge type-${transaction.transactionType.toLowerCase()}`}
        >
          {
            transaction
              .transactionType
          }
        </span>

      </td>


      <td>
        {transaction.description ||
          "—"}
      </td>


      <td>
        {accountNumber || "—"}
      </td>


      <td>

        <div className="table-amount">

          <span
            className={
              isCredit
                ? "credit-icon"
                : "debit-icon"
            }
          >

            {isCredit ? (
              <ArrowDownLeft
                size={16}
              />
            ) : (
              <ArrowUpRight
                size={16}
              />
            )}

          </span>


          <strong
            className={
              isCredit
                ? "positive"
                : "negative"
            }
          >
            {isCredit
              ? "+"
              : "-"}

            {formatCurrency(
              transaction.amount
            )}
          </strong>

        </div>

      </td>


      <td>

        <span
          className={`transaction-status status-${transaction.status.toLowerCase()}`}
        >
          {transaction.status}
        </span>

      </td>

    </tr>
  );
}


function TransactionDetailsModal({
  transaction,
  onClose,
}) {

  const isCredit =
    transaction.direction ===
    "CREDIT";

  return (
    <div className="transaction-details-backdrop">

      <div className="transaction-details-modal card">

        <div className="transaction-details-header">

          <div>

            <p className="transactions-eyebrow">
              Transaction
            </p>

            <h2>
              Transaction Details
            </h2>

          </div>

          <button
            type="button"
            className="transaction-details-close"
            onClick={
              onClose
            }
          >
            ×
          </button>

        </div>


        <DetailRow
          label="Reference"
          value={
            transaction
              .transactionReference
          }
        />

        <DetailRow
          label="Date & Time"
          value={
            formatFullDate(
              transaction
                .transactionDateTime
            )
          }
        />

        <DetailRow
          label="Type"
          value={
            transaction
              .transactionType
          }
        />

        <DetailRow
          label="Direction"
          value={
            transaction.direction ||
            "—"
          }
        />

        <DetailRow
          label="Status"
          value={
            transaction.status
          }
        />

        <DetailRow
          label="Amount"
          value={
            `${
              isCredit
                ? "+"
                : "-"
            }${formatCurrency(
              transaction.amount
            )}`
          }
        />

        <DetailRow
          label="Sender Account"
          value={
            transaction
              .senderAccountNumber ||
            "—"
          }
        />

        <DetailRow
          label="Receiver Account"
          value={
            transaction
              .receiverAccountNumber ||
            "—"
          }
        />

        <DetailRow
          label="Description"
          value={
            transaction.description ||
            "—"
          }
        />

      </div>

    </div>
  );
}


function DetailRow({
  label,
  value,
}) {

  return (
    <div className="transaction-detail-row">

      <span className="muted">
        {label}
      </span>

      <strong>
        {value}
      </strong>

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


function formatDate(date) {

  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}


function formatFullDate(date) {

  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}