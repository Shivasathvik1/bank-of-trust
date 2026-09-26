import { useEffect, useState } from "react";

import {
  Search,
  ReceiptText,
} from "lucide-react";

import api from "../../api/axios";

import {
  getApiError,
} from "../../utils/apiError";

import "./AdminTransactions.css";


export default function AdminTransactions() {

  const [
    transactions,
    setTransactions,
  ] =
    useState([]);


  const [
    page,
    setPage,
  ] =
    useState(0);


  const [
    size,
  ] =
    useState(10);


  const [
    totalPages,
    setTotalPages,
  ] =
    useState(0);


  const [
    totalElements,
    setTotalElements,
  ] =
    useState(0);


  const [
    type,
    setType,
  ] =
    useState("");


  const [
    fromDate,
    setFromDate,
  ] =
    useState("");


  const [
    toDate,
    setToDate,
  ] =
    useState("");


  const [
    reference,
    setReference,
  ] =
    useState("");


  const [
    selectedTransaction,
    setSelectedTransaction,
  ] =
    useState(null);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  useEffect(() => {

    loadTransactions();

  }, [
    page,
    type,
    fromDate,
    toDate,
  ]);


  // =====================================================
  // LOAD ADMIN TRANSACTIONS
  // =====================================================

  const loadTransactions =
    async () => {

      try {

        setLoading(true);

        setError("");


        const params = {
          page,
          size,
        };


        if (type) {

          params.type =
            type;

        }


        if (fromDate) {

          params.fromDate =
            `${fromDate}T00:00:00`;

        }


        if (toDate) {

          params.toDate =
            `${toDate}T23:59:59`;

        }


        const response =
          await api.get(
            "/admin/transactions",
            {
              params,
            }
          );


        /*
         * Backend now returns
         * Spring Page<BankTransactionDTO>
         */

        setTransactions(
          response.data?.content || []
        );


        setTotalElements(
          response.data?.totalElements ?? 0
        );


        setTotalPages(
          response.data?.totalPages ?? 0
        );


        /*
         * Use backend's page number
         * when available.
         */
        if (
          typeof response.data?.number
            === "number"
          &&
          response.data.number !== page
        ) {

          setPage(
            response.data.number
          );

        }

      } catch (error) {

        console.error(
          "ADMIN TRANSACTION ERROR:",
          error
        );


        const apiError =
          getApiError(error);


        setTransactions([]);

        setTotalElements(0);

        setTotalPages(0);


        setError(
          apiError.message ||
          "Unable to load transactions"
        );

      } finally {

        setLoading(false);

      }

    };


  // =====================================================
  // SEARCH BY REFERENCE
  // =====================================================

  const searchByReference =
    async (event) => {

      event.preventDefault();


      const cleanedReference =
        reference.trim();


      if (!cleanedReference) {

        setError(
          "Enter a transaction reference"
        );

        return;

      }


      try {

        setError("");

        setSelectedTransaction(
          null
        );


        const response =
          await api.get(
            `/admin/transactions/reference/${encodeURIComponent(
              cleanedReference
            )}`
          );


        setSelectedTransaction(
          response.data
        );

      } catch (error) {

        setSelectedTransaction(
          null
        );


        const apiError =
          getApiError(error);


        setError(
          apiError.message ||
          "Transaction not found"
        );

      }

    };


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters =
    () => {

      setType("");

      setFromDate("");

      setToDate("");

      setPage(0);

      setError("");

    };


  // =====================================================
  // DATE VALIDATION
  // =====================================================

  const handleFromDateChange =
    (event) => {

      const value =
        event.target.value;


      setFromDate(value);

      setPage(0);

      setError("");


      if (
        value &&
        toDate &&
        value > toDate
      ) {

        setError(
          "From date cannot be after To date"
        );

      }

    };


  const handleToDateChange =
    (event) => {

      const value =
        event.target.value;


      setToDate(value);

      setPage(0);

      setError("");


      if (
        fromDate &&
        value &&
        fromDate > value
      ) {

        setError(
          "To date cannot be before From date"
        );

      }

    };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="admin-transactions-page">


      {/* =========================
          HEADER
      ========================= */}

      <section className="admin-transactions-heading">

        <div>

          <p className="admin-transactions-eyebrow">

            Transaction Management

          </p>


          <h1>

            Transactions

          </h1>


          <p className="muted">

            Review Bank of Trust banking
            transaction activity.

          </p>

        </div>

      </section>



      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div
          className="admin-transactions-error"
          role="alert"
        >

          {error}

        </div>

      )}



      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <section className="admin-transaction-tools card">


        <form
          className="admin-reference-search"
          onSubmit={
            searchByReference
          }
        >

          <Search size={18} />


          <input
            type="text"
            aria-label="Transaction reference"
            placeholder="Search transaction reference..."
            value={reference}
            onChange={
              (event) => {

                setReference(
                  event.target.value
                );

                setError("");

              }
            }
          />


          <button
            className="btn btn-primary"
            type="submit"
          >

            Search

          </button>

        </form>



        <div className="admin-transaction-filters">


          {/* TYPE */}

          <div>

            <label
              htmlFor="adminTransactionType"
            >

              Transaction Type

            </label>


            <select
              id="adminTransactionType"
              className="form-input"
              value={type}
              onChange={
                (event) => {

                  setType(
                    event.target.value
                  );

                  setPage(0);

                  setError("");

                }
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



          {/* FROM DATE */}

          <div>

            <label
              htmlFor="adminFromDate"
            >

              From Date

            </label>


            <input
              id="adminFromDate"
              className="form-input"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={
                handleFromDateChange
              }
            />

          </div>



          {/* TO DATE */}

          <div>

            <label
              htmlFor="adminToDate"
            >

              To Date

            </label>


            <input
              id="adminToDate"
              className="form-input"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={
                handleToDateChange
              }
            />

          </div>



          {/* CLEAR */}

          <div className="admin-clear-filter">

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



      {/* =========================
          TRANSACTION TABLE
      ========================= */}

      <section className="admin-transaction-table-card card">


        <div className="admin-transaction-table-heading">

          <div>

            <h2>

              Transaction History

            </h2>


            <p className="muted">

              {totalElements}

              {" "}

              transaction

              {totalElements === 1
                ? ""
                : "s"}

            </p>

          </div>


          <div className="admin-transaction-icon">

            <ReceiptText
              size={22}
            />

          </div>

        </div>



        {loading ? (

          <div className="admin-transactions-loading">

            Loading transactions...

          </div>

        ) : transactions.length === 0 ? (

          <div className="admin-transactions-empty">

            <ReceiptText
              size={32}
            />


            <h3>

              No transactions found

            </h3>


            <p className="muted">

              There are no transactions
              matching your current filters.

            </p>

          </div>

        ) : (

          <div className="admin-transaction-table-wrapper">

            <table className="admin-transaction-table">

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
                    Sender
                  </th>

                  <th>
                    Receiver
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

                    <TransactionRow
                      key={
                        transaction
                          .transactionReference ||
                        transaction.id
                      }
                      transaction={
                        transaction
                      }
                      onClick={
                        () =>
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



        {/* =========================
            PAGINATION
        ========================= */}

        <div className="admin-pagination">


          <button
            type="button"
            className="btn btn-secondary"
            disabled={
              loading ||
              page === 0
            }
            onClick={
              () =>
                setPage(
                  (current) =>
                    Math.max(
                      current - 1,
                      0
                    )
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
            type="button"
            className="btn btn-secondary"
            disabled={
              loading ||
              totalPages === 0 ||
              page + 1 >=
                totalPages
            }
            onClick={
              () =>
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



      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedTransaction && (

        <TransactionDetailsModal
          transaction={
            selectedTransaction
          }
          onClose={
            () =>
              setSelectedTransaction(
                null
              )
          }
        />

      )}

    </div>

  );

}



// =====================================================
// TRANSACTION ROW
// =====================================================

function TransactionRow({
  transaction,
  onClick,
}) {

  return (

    <tr
      className="admin-transaction-row"
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={
        (event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            onClick();

          }

        }
      }
    >


      <td>

        {formatDate(
          transaction
            .transactionDateTime
        )}

      </td>


      <td className="admin-reference-cell">

        {
          transaction
            .transactionReference ||
          "—"
        }

      </td>


      <td>

        <span
          className={`admin-type-badge type-${String(
            transaction.transactionType ||
            ""
          ).toLowerCase()}`}
        >

          {
            transaction
              .transactionType ||
            "—"
          }

        </span>

      </td>


      <td>

        {
          transaction
            .senderAccountNumber ||
          "—"
        }

      </td>


      <td>

        {
          transaction
            .receiverAccountNumber ||
          "—"
        }

      </td>


      <td>

        <strong>

          {formatCurrency(
            transaction.amount
          )}

        </strong>

      </td>


      <td>

        <span
          className={`admin-transaction-status status-${String(
            transaction.status ||
            ""
          ).toLowerCase()}`}
        >

          {
            transaction.status ||
            "—"
          }

        </span>

      </td>

    </tr>

  );

}



// =====================================================
// TRANSACTION DETAILS MODAL
// =====================================================

function TransactionDetailsModal({
  transaction,
  onClose,
}) {

  return (

    <div
      className="admin-transaction-modal-backdrop"
      onMouseDown={
        (event) => {

          if (
            event.target ===
            event.currentTarget
          ) {

            onClose();

          }

        }
      }
    >

      <div
        className="admin-transaction-modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-details-title"
      >


        <div className="admin-transaction-modal-header">

          <div>

            <p className="admin-transactions-eyebrow">

              Transaction

            </p>


            <h2 id="transaction-details-title">

              Transaction Details

            </h2>

          </div>


          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close transaction details"
          >

            ×

          </button>

        </div>



        <DetailRow
          label="Reference"
          value={
            transaction
              .transactionReference ||
            "—"
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
          label="Transaction Type"
          value={
            transaction
              .transactionType ||
            "—"
          }
        />


        <DetailRow
          label="Status"
          value={
            transaction.status ||
            "—"
          }
        />


        <DetailRow
          label="Amount"
          value={
            formatCurrency(
              transaction.amount
            )
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
            transaction
              .description ||
            "—"
          }
        />

      </div>

    </div>

  );

}



// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
  label,
  value,
}) {

  return (

    <div className="admin-transaction-detail-row">

      <span className="muted">

        {label}

      </span>


      <strong>

        {value}

      </strong>

    </div>

  );

}



// =====================================================
// FORMAT CURRENCY
// =====================================================

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



// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(
  date
) {

  if (!date) {

    return "—";

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



// =====================================================
// FORMAT FULL DATE
// =====================================================

function formatFullDate(
  date
) {

  if (!date) {

    return "—";

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