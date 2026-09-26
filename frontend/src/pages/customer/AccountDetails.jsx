import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Filter,
  Landmark,
  RotateCcw,
  Send,
  WalletCards,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api
  from "../../api/axios";

import {
  getApiError,
} from "../../utils/apiError";

import DepositModal
  from "../../components/transactions/DepositModal";

import WithdrawModal
  from "../../components/transactions/WithdrawModal";

import "./AccountDetails.css";


export default function AccountDetails() {

  const {
    accountNumber,
  } = useParams();


  const [account, setAccount] =
    useState(null);

  const [
    transactions,
    setTransactions,
  ] = useState([]);


  const [page, setPage] =
    useState(0);

  const [
    totalPages,
    setTotalPages,
  ] = useState(0);

  const [
    totalElements,
    setTotalElements,
  ] = useState(0);


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const [
    showDeposit,
    setShowDeposit,
  ] = useState(false);

  const [
    showWithdraw,
    setShowWithdraw,
  ] = useState(false);


  // =========================
  // FILTER FORM
  // =========================

  const [filters, setFilters] =
    useState({
      type: "",
      from: "",
      to: "",
    });


  // Actual filters currently
  // sent to backend
  const [
    appliedFilters,
    setAppliedFilters,
  ] = useState({
    type: "",
    from: "",
    to: "",
  });


  // =========================
  // LOAD ACCOUNT
  // =========================

  const loadAccount =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError("");


          const params = {
            page,
            size: 10,
          };


          if (
            appliedFilters.type
          ) {

            params.type =
              appliedFilters.type;

          }


          if (
            appliedFilters.from
          ) {

            params.from =
              `${appliedFilters.from}T00:00:00`;

          }


          if (
            appliedFilters.to
          ) {

            params.to =
              `${appliedFilters.to}T23:59:59`;

          }


          const [
            accountResponse,
            transactionResponse,
          ] =
            await Promise.all([

              api.get(
                `/customers/me/accounts/${accountNumber}`
              ),

              api.get(
                `/transactions/my/account/${accountNumber}`,
                {
                  params,
                }
              ),

            ]);


          setAccount(
            accountResponse.data
          );


          setTransactions(
            transactionResponse.data
              ?.content || []
          );


          setTotalPages(
            transactionResponse.data
              ?.totalPages || 0
          );


          setTotalElements(
            transactionResponse.data
              ?.totalElements || 0
          );

        } catch (error) {

          console.error(error);


          const apiError =
            getApiError(error);


          setError(
            apiError.message
          );

        } finally {

          setLoading(false);

        }

      },
      [
        accountNumber,
        page,
        appliedFilters,
      ]
    );


  useEffect(() => {

    loadAccount();

  }, [loadAccount]);


  // =========================
  // FILTER HANDLERS
  // =========================

  const handleFilterChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFilters(
        (current) => ({
          ...current,
          [name]: value,
        })
      );

    };


  const applyFilters =
    (event) => {

      event.preventDefault();


      if (
        filters.from &&
        filters.to &&
        filters.from >
          filters.to
      ) {

        setError(
          "From date cannot be after to date."
        );

        return;
      }


      setError("");

      setPage(0);


      setAppliedFilters({
        ...filters,
      });

    };


  const clearFilters =
    () => {

      const cleared = {
        type: "",
        from: "",
        to: "",
      };


      setFilters(cleared);

      setAppliedFilters(
        cleared
      );

      setPage(0);

      setError("");

    };


  if (
    loading &&
    !account
  ) {

    return (

      <div className="account-details-loading card">

        Loading account details...

      </div>

    );

  }


  if (
    error &&
    !account
  ) {

    return (

      <div className="account-details-error">

        <h3>
          Unable to load account
        </h3>

        <p>
          {error}
        </p>

        <Link
          to="/accounts"
          className="btn btn-secondary"
        >
          Back to Accounts
        </Link>

      </div>

    );

  }


  if (!account) {

    return null;

  }


  const active =
    account.status === "ACTIVE";


  return (

    <div className="account-details-page">


      <Link
        to="/accounts"
        className="account-back-link"
      >

        <ArrowLeft
          size={17}
        />

        Back to Accounts

      </Link>


      {/* ACCOUNT HEADER */}

      <section className="account-details-header card">


        <div className="account-details-title">


          <div className="account-details-title-icon">

            <Landmark
              size={25}
            />

          </div>


          <div>

            <p className="account-details-eyebrow">

              {account.accountType}
              {" ACCOUNT"}

            </p>


            <h1>

              Account ••••{" "}

              {String(
                account.accountNumber
              ).slice(-4)}

            </h1>


            <span
              className={
                `account-details-status ${
                  active
                    ? "account-detail-active"
                    : "account-detail-disabled"
                }`
              }
            >

              {account.status}

            </span>

          </div>


        </div>


        <div className="account-detail-balance">

          <span className="muted">
            Available Balance
          </span>

          <h2>

            {formatCurrency(
              account.balance
            )}

          </h2>

        </div>


      </section>


      {/* INFO */}

      <section className="account-information-grid">


        <InfoCard

          icon={
            <CreditCard
              size={20}
            />
          }

          label="Account Number"

          value={
            account.accountNumber
          }

        />


        <InfoCard

          icon={
            <WalletCards
              size={20}
            />
          }

          label="Account Type"

          value={
            account.accountType
          }

        />


        <InfoCard

          icon={
            <Landmark
              size={20}
            />
          }

          label="Status"

          value={
            account.status
          }

        />


        <InfoCard

          icon={
            <CalendarDays
              size={20}
            />
          }

          label="Created"

          value={
            formatDate(
              account.createdAt
            )
          }

        />


      </section>


      {/* ACTIONS */}

      <section className="account-detail-actions">


        <Link
          to="/transfer"
          className="account-action-card"
        >

          <Send
            size={20}
          />

          Transfer

        </Link>


        <button
          type="button"
          className="account-action-card"
          disabled={!active}
          onClick={() =>
            setShowDeposit(true)
          }
        >

          <ArrowDownLeft
            size={20}
          />

          Deposit

        </button>


        <button
          type="button"
          className="account-action-card"
          disabled={!active}
          onClick={() =>
            setShowWithdraw(true)
          }
        >

          <ArrowUpRight
            size={20}
          />

          Withdraw

        </button>


      </section>


      {!active && (

        <div className="account-unavailable-message">

          This account is currently{" "}

          <strong>
            {account.status}
          </strong>

          . Money operations are disabled.

        </div>

      )}


      {/* TRANSACTION SECTION */}

      <section className="account-transactions card">


        <div className="account-transactions-heading">

          <div>

            <h2>
              Account Activity
            </h2>

            <p className="muted">

              {totalElements}{" "}

              {totalElements === 1
                ? "transaction"
                : "transactions"}

            </p>

          </div>

        </div>


        {/* FILTERS */}

        <form
          className="account-transaction-filters"
          onSubmit={applyFilters}
        >


          <div className="account-filter-field">

            <label
              htmlFor="transaction-type"
            >
              Transaction Type
            </label>


            <select
              id="transaction-type"
              className="form-input"
              name="type"
              value={filters.type}
              onChange={
                handleFilterChange
              }
            >

              <option value="">
                All Transactions
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


          <div className="account-filter-field">

            <label
              htmlFor="from-date"
            >
              From Date
            </label>


            <input
              id="from-date"
              className="form-input"
              type="date"
              name="from"
              value={filters.from}
              onChange={
                handleFilterChange
              }
            />

          </div>


          <div className="account-filter-field">

            <label
              htmlFor="to-date"
            >
              To Date
            </label>


            <input
              id="to-date"
              className="form-input"
              type="date"
              name="to"
              value={filters.to}
              onChange={
                handleFilterChange
              }
            />

          </div>


          <div className="account-filter-buttons">

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >

              <Filter
                size={16}
              />

              Apply

            </button>


            <button
              type="button"
              className="btn btn-secondary"
              onClick={
                clearFilters
              }
              disabled={loading}
            >

              <RotateCcw
                size={16}
              />

              Clear

            </button>

          </div>


        </form>


        {error && (

          <div
            className="account-filter-error"
            role="alert"
          >

            {error}

          </div>

        )}


        {loading ? (

          <div className="account-transactions-loading">

            Loading transactions...

          </div>

        ) : transactions.length === 0 ? (

          <div className="account-no-transactions">

            No transactions found
            matching these filters.

          </div>

        ) : (

          <div className="account-transaction-list">


            {transactions.map(
              (transaction) => (

                <TransactionItem

                  key={
                    transaction
                      .transactionReference
                  }

                  transaction={
                    transaction
                  }

                />

              )
            )}


          </div>

        )}


        {totalPages > 1 && (

          <div className="account-pagination">


            <button
              type="button"
              className="btn btn-secondary"
              disabled={
                page === 0 ||
                loading
              }
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
              {page + 1}
              {" of "}
              {totalPages}

            </span>


            <button
              type="button"
              className="btn btn-secondary"
              disabled={
                loading ||
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

        )}


      </section>


      {showDeposit && (

        <DepositModal

          accounts={[
            account,
          ]}

          onClose={() =>
            setShowDeposit(false)
          }

          onSuccess={
            loadAccount
          }

        />

      )}


      {showWithdraw && (

        <WithdrawModal

          accounts={[
            account,
          ]}

          onClose={() =>
            setShowWithdraw(false)
          }

          onSuccess={
            loadAccount
          }

        />

      )}


    </div>

  );
}


function InfoCard({
  icon,
  label,
  value,
}) {

  return (

    <div className="account-info-card card">

      <div className="account-info-icon">
        {icon}
      </div>

      <div>

        <span className="muted">
          {label}
        </span>

        <strong>
          {value || "—"}
        </strong>

      </div>

    </div>

  );
}


function TransactionItem({
  transaction,
}) {

  const credit =
    transaction.direction ===
    "CREDIT";


  return (

    <div className="account-transaction-item">


      <div
        className={
          `account-transaction-icon ${
            credit
              ? "account-credit-icon"
              : "account-debit-icon"
          }`
        }
      >

        {credit ? (

          <ArrowDownLeft
            size={18}
          />

        ) : (

          <ArrowUpRight
            size={18}
          />

        )}

      </div>


      <div className="account-transaction-info">

        <strong>

          {
            transaction.description ||
            formatTransactionType(
              transaction.transactionType
            )
          }

        </strong>


        <span className="muted">

          {formatTransactionType(
            transaction.transactionType
          )}

          {" • "}

          {formatTransactionDate(
            transaction
              .transactionDateTime
          )}

        </span>


        <small className="account-transaction-reference">

          Ref:{" "}

          {
            transaction
              .transactionReference
          }

        </small>

      </div>


      <div className="account-transaction-amount">

        <strong
          className={
            credit
              ? "positive"
              : "negative"
          }
        >

          {credit
            ? "+"
            : "-"}

          {formatCurrency(
            transaction.amount
          )}

        </strong>


        <span className="muted">

          {transaction.status}

        </span>

      </div>


    </div>

  );
}


function formatTransactionType(
  type
) {

  if (
    type === "WITHDRAWAL"
  ) {

    return "Withdrawal";

  }


  if (
    type === "DEPOSIT"
  ) {

    return "Deposit";

  }


  if (
    type === "TRANSFER"
  ) {

    return "Transfer";

  }


  return type || "Transaction";
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
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}


function formatTransactionDate(
  date
) {

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