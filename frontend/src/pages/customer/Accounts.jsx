import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Landmark,
  WalletCards,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import api
  from "../../api/axios";

import {
  getApiError,
} from "../../utils/apiError";

import "./Accounts.css";


export default function Accounts() {

  const [accounts, setAccounts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    loadAccounts();

  }, []);


  const loadAccounts =
    async () => {

      try {

        setLoading(true);

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
          apiError.message
        );

      } finally {

        setLoading(false);

      }

    };


  const totalBalance =
    useMemo(() => {

      return accounts.reduce(
        (total, account) => {

          return total +
            Number(
              account.balance || 0
            );

        },
        0
      );

    }, [accounts]);


  const activeAccounts =
    useMemo(() => {

      return accounts.filter(
        (account) =>
          account.status === "ACTIVE"
      ).length;

    }, [accounts]);


  if (loading) {

    return (

      <div className="accounts-loading card">

        Loading accounts...

      </div>

    );
  }


  return (

    <div className="accounts-page">


      {/* =========================
          HEADING
      ========================= */}

      <section className="accounts-heading">

        <div>

          <p className="accounts-eyebrow">
            Banking
          </p>

          <h1>
            My Accounts
          </h1>

          <p className="muted">
            View your bank accounts,
            balances and transaction
            history.
          </p>

        </div>

      </section>



      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div
          className="accounts-error"
          role="alert"
        >

          {error}

        </div>

      )}



      {/* =========================
          SUMMARY
      ========================= */}

      <section className="accounts-summary">


        <div className="account-summary-card card">

          <div className="account-summary-icon">

            <Landmark
              size={22}
            />

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



        <div className="account-summary-card card">

          <div className="account-summary-icon">

            <WalletCards
              size={22}
            />

          </div>


          <div>

            <span className="muted">
              Total Accounts
            </span>

            <h2>
              {accounts.length}
            </h2>

          </div>

        </div>



        <div className="account-summary-card card">

          <div className="account-summary-icon">

            <WalletCards
              size={22}
            />

          </div>


          <div>

            <span className="muted">
              Active Accounts
            </span>

            <h2>
              {activeAccounts}
            </h2>

          </div>

        </div>


      </section>



      {/* =========================
          ACCOUNT LIST
      ========================= */}

      <section className="accounts-list">


        <div className="accounts-section-title">

          <div>

            <h2>
              Bank Accounts
            </h2>

            <p className="muted">
              Click an account to view
              complete account information.
            </p>

          </div>

        </div>



        {accounts.length === 0 ? (

          <div className="accounts-empty card">

            No bank accounts found.

          </div>

        ) : (

          <div className="accounts-grid">

            {accounts.map(
              (account) => (

                <Link

                  key={
                    account.accountNumber
                  }

                  to={
                    `/accounts/${account.accountNumber}`
                  }

                  className="account-details-link"

                >

                  <AccountCard
                    account={account}
                  />

                </Link>

              )
            )}

          </div>

        )}


      </section>


    </div>

  );
}



function AccountCard({
  account,
}) {

  const active =
    account.status === "ACTIVE";


  return (

    <div className="full-account-card card">


      <div className="full-account-header">


        <div className="account-card-icon">

          <WalletCards
            size={22}
          />

        </div>


        <span
          className={
            `status-badge ${
              active
                ? "status-active"
                : "status-disabled"
            }`
          }
        >

          {account.status}

        </span>


      </div>



      <div className="full-account-type">

        <span className="muted">
          Account Type
        </span>

        <h3>
          {account.accountType}
        </h3>

      </div>



      <div className="full-account-number">

        <span className="muted">
          Account Number
        </span>

        <strong>
          {account.accountNumber}
        </strong>

      </div>



      <div className="full-account-balance">

        <span className="muted">
          Available Balance
        </span>

        <h2>

          {formatCurrency(
            account.balance
          )}

        </h2>

      </div>



      <div className="account-view-details">

        <span>
          View Account
        </span>

        <ArrowRight
          size={17}
        />

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