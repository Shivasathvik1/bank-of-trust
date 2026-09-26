import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Landmark,
  Mail,
  MapPin,
  Phone,
  UserRound,
  WalletCards,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../api/axios";

import {
  getApiError,
} from "../../utils/apiError";

import "./AdminAccountDetails.css";


export default function AdminAccountDetails() {

  const {
    accountNumber,
  } =
    useParams();


  const navigate =
    useNavigate();


  const [
    account,
    setAccount,
  ] =
    useState(null);


  const [
    transactions,
    setTransactions,
  ] =
    useState([]);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    updatingStatus,
    setUpdatingStatus,
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

    loadAccountDetails();

  }, [accountNumber]);


  // =========================================
  // LOAD DETAILS
  // =========================================

  const loadAccountDetails =
    async () => {

      try {

        setLoading(true);

        setError("");


        const accountResponse =
          await api.get(
            `/admin/accounts/${accountNumber}`
          );


        setAccount(
          accountResponse.data
        );


        try {

          const transactionResponse =
            await api.get(
              `/admin/transactions/account/${accountNumber}`
            );


          setTransactions(
            Array.isArray(
              transactionResponse.data
            )
              ? transactionResponse.data
              : []
          );

        } catch (transactionError) {

          /*
           * If backend returns 404 for
           * an account with no transactions,
           * show an empty transaction list.
           */

          if (
            transactionError?.response
              ?.status === 404
          ) {

            setTransactions([]);

          } else {

            throw transactionError;

          }

        }

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


  // =========================================
  // UPDATE STATUS
  // =========================================

  const updateStatus =
    async (status) => {

      try {

        setUpdatingStatus(true);

        setError("");

        setSuccess("");


        await api.put(
          `/admin/accounts/${accountNumber}/status`,
          null,
          {
            params: {
              status,
            },
          }
        );


        setAccount(
          (current) => ({
            ...current,
            status,
          })
        );


        setSuccess(
          `Account status changed to ${status}.`
        );

      } catch (error) {

        const apiError =
          getApiError(error);


        setError(
          apiError.message
        );

      } finally {

        setUpdatingStatus(false);

      }

    };


  if (loading) {

    return (

      <div className="admin-account-detail-loading">

        Loading account information...

      </div>

    );

  }


  if (error && !account) {

    return (

      <div className="admin-account-detail-page">


        <button
          type="button"
          className="admin-account-back"
          onClick={() =>
            navigate(
              "/admin/accounts"
            )
          }
        >

          <ArrowLeft size={18} />

          Back to Bank Accounts

        </button>


        <div className="admin-account-error">

          {error}

        </div>


      </div>

    );

  }


  if (!account) {

    return null;

  }


  return (

    <div className="admin-account-detail-page">


      {/* BACK */}

      <button

        type="button"

        className="admin-account-back"

        onClick={() =>
          navigate(
            "/admin/accounts"
          )
        }

      >

        <ArrowLeft size={18} />

        Back to Bank Accounts

      </button>



      {/* HEADER */}

      <section className="admin-account-detail-header">


        <div>


          <p className="admin-account-detail-eyebrow">

            Bank Account Details

          </p>


          <h1>

            {account.accountType}
            {" "}
            Account

          </h1>


          <p className="muted">

            Account{" "}
            {account.accountNumber}

          </p>


        </div>



        <div className="admin-account-header-actions">


          <select

            className="form-input admin-account-status-select"

            value={
              account.status
            }

            disabled={
              updatingStatus
            }

            onChange={
              (event) =>
                updateStatus(
                  event.target.value
                )
            }

          >

            <option value="ACTIVE">

              ACTIVE

            </option>


            <option value="BLOCKED">

              BLOCKED

            </option>


            <option value="CLOSED">

              CLOSED

            </option>


          </select>


        </div>


      </section>



      {error && (

        <div className="admin-account-error">

          {error}

        </div>

      )}


      {success && (

        <div className="admin-account-success">

          {success}

        </div>

      )}



      {/* BALANCE */}

      <section className="admin-account-hero card">


        <div className="admin-account-hero-icon">

          <CircleDollarSign
            size={29}
          />

        </div>


        <div>


          <span className="muted">

            Available Balance

          </span>


          <h2>

            {formatCurrency(
              account.balance
            )}

          </h2>


          <p>

            {account.accountType}
            {" • "}
            {account.status}

          </p>


        </div>


      </section>



      {/* ACCOUNT INFORMATION */}

      <section className="admin-detail-section card">


        <div className="admin-detail-section-heading">


          <Landmark size={20} />


          <div>

            <h2>

              Account Information

            </h2>

            <p className="muted">

              Banking details for this
              account.

            </p>

          </div>


        </div>



        <div className="admin-detail-info-grid">


          <InfoItem

            icon={
              <Landmark
                size={18}
              />
            }

            label="Account Number"

            value={
              account.accountNumber
            }

          />


          <InfoItem

            icon={
              <WalletCards
                size={18}
              />
            }

            label="Account Type"

            value={
              account.accountType
            }

          />


          <InfoItem

            icon={
              <CircleDollarSign
                size={18}
              />
            }

            label="Balance"

            value={
              formatCurrency(
                account.balance
              )
            }

          />


          <InfoItem

            icon={
              <CalendarDays
                size={18}
              />
            }

            label="Created"

            value={
              formatDate(
                account.createdAt
              )
            }

          />


        </div>


      </section>



      {/* CUSTOMER INFORMATION */}

      <section className="admin-detail-section card">


        <div className="admin-detail-section-heading">


          <UserRound size={20} />


          <div>

            <h2>

              Customer Information

            </h2>

            <p className="muted">

              Owner of this bank account.

            </p>

          </div>


        </div>



        <div className="admin-customer-owner-header">


          <div className="admin-owner-avatar">

            {getInitials(
              account.firstName,
              account.lastName
            )}

          </div>


          <div>

            <h3>

              {account.firstName}{" "}
              {account.lastName}

            </h3>


            <p className="muted">

              Customer ID #
              {account.customerId}

            </p>

          </div>


          <span
            className={`admin-owner-status admin-owner-status-${String(
              account.customerStatus
            ).toLowerCase()}`}
          >

            {account.customerStatus}

          </span>


        </div>



        <div className="admin-detail-info-grid">


          <InfoItem

            icon={
              <Mail size={18} />
            }

            label="Email"

            value={
              account.email
            }

          />


          <InfoItem

            icon={
              <Phone size={18} />
            }

            label="Phone"

            value={
              account.phoneNumber
            }

          />


          <InfoItem

            icon={
              <MapPin size={18} />
            }

            label="Address"

            value={
              account.address
            }

          />


          <InfoItem

            icon={
              <UserRound
                size={18}
              />
            }

            label="Customer Status"

            value={
              account.customerStatus
            }

          />


        </div>


      </section>



      {/* TRANSACTIONS */}

      <section className="admin-detail-section card">


        <div className="admin-transactions-header">


          <div className="admin-detail-section-heading">


            <WalletCards size={20} />


            <div>

              <h2>

                Transactions

              </h2>


              <p className="muted">

                Transaction history for
                account{" "}
                {account.accountNumber}.

              </p>

            </div>


          </div>


          <span className="admin-transaction-count">

            {transactions.length}
            {" "}
            {transactions.length === 1
              ? "Transaction"
              : "Transactions"}

          </span>


        </div>



        {transactions.length ===
        0 ? (

          <div className="admin-no-transactions">

            No transactions found for
            this account.

          </div>

        ) : (

          <div className="admin-account-transaction-table-wrapper">


            <table className="admin-account-transaction-table">


              <thead>

                <tr>

                  <th>
                    Transaction
                  </th>

                  <th>
                    Reference
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    From
                  </th>

                  <th>
                    To
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Amount
                  </th>

                </tr>

              </thead>



              <tbody>


                {transactions.map(
                  (transaction) => (

                    <TransactionRow

                      key={
                        transaction.id
                      }

                      transaction={
                        transaction
                      }

                    />

                  )
                )}


              </tbody>


            </table>


          </div>

        )}


      </section>


    </div>

  );
}



function InfoItem({
  icon,
  label,
  value,
}) {

  return (

    <div className="admin-detail-info-item">


      <div className="admin-detail-info-icon">

        {icon}

      </div>


      <div>

        <span>

          {label}

        </span>


        <strong>

          {value ?? "—"}

        </strong>

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

    <tr>


      <td>


        <div className="admin-transaction-type-cell">


          <div
            className={`admin-transaction-direction-icon ${
              isCredit
                ? "credit"
                : "debit"
            }`}
          >

            {isCredit
              ? (
                <ArrowDownLeft
                  size={17}
                />
              )
              : (
                <ArrowUpRight
                  size={17}
                />
              )}

          </div>


          <div>

            <strong>

              {transaction.transactionType}

            </strong>

            <span>

              {transaction.direction ||
                "—"}

            </span>

          </div>


        </div>


      </td>



      <td>

        {transaction.transactionReference}

      </td>



      <td>

        {formatDateTime(
          transaction.transactionDateTime
        )}

      </td>



      <td>

        {transaction.senderAccountNumber ||
          "—"}

      </td>



      <td>

        {transaction.receiverAccountNumber ||
          "—"}

      </td>



      <td>


        <span
          className={`admin-transaction-status admin-transaction-status-${String(
            transaction.status
          ).toLowerCase()}`}
        >

          {transaction.status}

        </span>


      </td>



      <td>


        <strong
          className={
            isCredit
              ? "admin-amount-credit"
              : "admin-amount-debit"
          }
        >

          {isCredit
            ? "+"
            : "-"}

          {formatCurrency(
            transaction.amount
          )}

        </strong>


      </td>


    </tr>

  );
}



function getInitials(
  firstName,
  lastName
) {

  return `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase() || "U";

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
  value
) {

  if (!value) {

    return "—";

  }


  return new Date(
    value
  ).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

}



function formatDateTime(
  value
) {

  if (!value) {

    return "—";

  }


  return new Date(
    value
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