import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Landmark,
  WalletCards,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import api from "../../api/axios";

import DepositModal
  from "../../components/transactions/DepositModal";

import WithdrawModal
  from "../../components/transactions/WithdrawModal";

import "./Dashboard.css";

export default function Dashboard() {
  const [profile, setProfile] =
    useState(null);

  const [accounts, setAccounts] =
    useState([]);

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showDeposit, setShowDeposit] =
    useState(false);

  const [showWithdraw, setShowWithdraw] =
    useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        profileResponse,
        accountsResponse,
        transactionResponse,
      ] = await Promise.all([
        api.get("/customers/me"),

        api.get(
          "/customers/me/accounts"
        ),

        api.get(
          "/transactions/my?page=0&size=5"
        ),
      ]);

      setProfile(
        profileResponse.data
      );

      setAccounts(
        Array.isArray(
          accountsResponse.data
        )
          ? accountsResponse.data
          : []
      );

      setTransactions(
        transactionResponse.data
          ?.content || []
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  const totalBalance =
    useMemo(() => {

      return accounts.reduce(
        (total, account) =>
          total +
          Number(
            account.balance || 0
          ),
        0
      );

    }, [accounts]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">

        <h3>
          Unable to load dashboard
        </h3>

        <p>
          {error}
        </p>

        <button
          className="btn btn-primary"
          onClick={loadDashboard}
        >
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <section className="dashboard-heading">

        <div>

          <p className="dashboard-eyebrow">
            Customer Dashboard
          </p>

          <h1>
            Welcome back
            {profile?.firstName
              ? `, ${profile.firstName}`
              : ""}
            👋
          </h1>

          <p className="muted">
            Here's an overview of your
            Bank of Trust accounts.
          </p>

        </div>

      </section>


      <section className="dashboard-stats">

        <div className="dashboard-stat card">

          <div className="stat-icon balance-icon">
            <Landmark size={22} />
          </div>

          <div>

            <span className="muted">
              Total Balance
            </span>

            <h2>
              {formatCurrency(
                totalBalance
              )}
            </h2>

          </div>

        </div>


        <div className="dashboard-stat card">

          <div className="stat-icon account-icon">
            <WalletCards size={22} />
          </div>

          <div>

            <span className="muted">
              Accounts
            </span>

            <h2>
              {accounts.length}
            </h2>

          </div>

        </div>


        <div className="dashboard-stat card">

          <div className="stat-icon transaction-icon">
            <ArrowRight size={22} />
          </div>

          <div>

            <span className="muted">
              Recent Transactions
            </span>

            <h2>
              {transactions.length}
            </h2>

          </div>

        </div>

      </section>


      <section className="quick-actions">

        <Link
          to="/transfer"
          className="quick-action transfer-action"
        >
          <ArrowUpRight size={20} />

          <span>
            Transfer
          </span>
        </Link>


        <button
          type="button"
          className="quick-action deposit-action"
          onClick={() =>
            setShowDeposit(true)
          }
        >
          <ArrowDownLeft size={20} />

          <span>
            Deposit
          </span>
        </button>


        <button
          type="button"
          className="quick-action withdraw-action"
          onClick={() =>
            setShowWithdraw(true)
          }
        >
          <ArrowUpRight size={20} />

          <span>
            Withdraw
          </span>
        </button>

      </section>


      <section className="dashboard-grid">

        <div className="accounts-section">

          <div className="section-title">

            <div>

              <h2>
                Your Accounts
              </h2>

              <p className="muted">
                Your active bank accounts
              </p>

            </div>

            <Link
              to="/accounts"
              className="section-link"
            >
              View All

              <ArrowRight
                size={16}
              />
            </Link>

          </div>


          <div className="account-card-grid">

            {accounts.length === 0 ? (

              <div className="empty-card card">
                No bank accounts found.
              </div>

            ) : (

              accounts.map(
                (account) => (

                  <AccountCard
                    key={
                      account.accountNumber
                    }
                    account={account}
                  />

                )
              )

            )}

          </div>

        </div>


        <div className="transactions-section card">

          <div className="section-title">

            <div>

              <h2>
                Recent Transactions
              </h2>

              <p className="muted">
                Your latest activity
              </p>

            </div>

            <Link
              to="/transactions"
              className="section-link"
            >
              View All

              <ArrowRight
                size={16}
              />
            </Link>

          </div>


          <div className="transaction-list">

            {transactions.length === 0 ? (

              <p className="muted">
                No transactions yet.
              </p>

            ) : (

              transactions.map(
                (transaction) => (

                  <TransactionRow
                    key={
                      transaction
                        .transactionReference
                    }
                    transaction={
                      transaction
                    }
                  />

                )
              )

            )}

          </div>

        </div>

      </section>


      {showDeposit && (

        <DepositModal
          accounts={accounts}

          onClose={() =>
            setShowDeposit(false)
          }

          onSuccess={
            loadDashboard
          }
        />

      )}


      {showWithdraw && (

        <WithdrawModal
          accounts={accounts}

          onClose={() =>
            setShowWithdraw(false)
          }

          onSuccess={
            loadDashboard
          }
        />

      )}

    </div>
  );
}


function AccountCard({
  account,
}) {

  return (
    <div className="bank-account-card card">

      <div className="account-top">

        <div>

          <span className="account-type">
            {account.accountType}
          </span>

          <p className="muted">
            ••••{" "}
            {String(
              account.accountNumber
            ).slice(-4)}
          </p>

        </div>


        <span
          className={`status-badge ${
            account.status ===
            "ACTIVE"
              ? "status-active"
              : "status-disabled"
          }`}
        >
          {account.status}
        </span>

      </div>


      <div className="account-balance">

        <span className="muted">
          Available Balance
        </span>

        <h2>
          {formatCurrency(
            account.balance
          )}
        </h2>

      </div>

    </div>
  );
}


function TransactionRow({
  transaction,
}) {

  const isCredit =
    transaction.direction ===
    "CREDIT";

  return (
    <div className="dashboard-transaction-row">

      <div
        className={`transaction-symbol ${
          isCredit
            ? "credit-symbol"
            : "debit-symbol"
        }`}
      >

        {isCredit ? (

          <ArrowDownLeft
            size={18}
          />

        ) : (

          <ArrowUpRight
            size={18}
          />

        )}

      </div>


      <div className="transaction-info">

        <strong>
          {formatTransactionName(
            transaction
          )}
        </strong>

        <span className="muted">
          {formatDate(
            transaction
              .transactionDateTime
          )}
        </span>

      </div>


      <div className="transaction-amount">

        <strong
          className={
            isCredit
              ? "positive"
              : "negative"
          }
        >
          {isCredit ? "+" : "-"}

          {formatCurrency(
            transaction.amount
          )}
        </strong>

        <span className="muted">
          {
            transaction
              .transactionType
          }
        </span>

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
    Number(amount || 0)
  );
}


function formatDate(
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
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


function formatTransactionName(
  transaction
) {

  if (
    transaction.description
  ) {
    return transaction.description;
  }

  if (
    transaction
      .transactionType ===
    "DEPOSIT"
  ) {
    return "Deposit";
  }

  if (
    transaction
      .transactionType ===
    "WITHDRAWAL"
  ) {
    return "Withdrawal";
  }

  return "Transfer";
}