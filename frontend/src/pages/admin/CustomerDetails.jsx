import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Landmark,
  Mail,
  MapPin,
  Phone,
  CalendarDays,
  ChevronRight,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api
  from "../../api/axios";

import "./CustomerDetails.css";


export default function CustomerDetails() {

  const {
    customerId,
  } =
    useParams();


  const navigate =
    useNavigate();


  const [
    customer,
    setCustomer,
  ] =
    useState(null);


  const [
    accounts,
    setAccounts,
  ] =
    useState([]);


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

    loadCustomerDetails();

  }, [customerId]);


  const loadCustomerDetails =
    async () => {

      try {

        setLoading(true);

        setError("");


        const [
          customerResponse,
          accountsResponse,
        ] =
          await Promise.all([

            api.get(
              `/admin/customers/${customerId}`
            ),

            api.get(
              `/admin/customers/${customerId}/accounts`
            ),

          ]);


        setCustomer(
          customerResponse.data
        );


        setAccounts(
          Array.isArray(
            accountsResponse.data
          )
            ? accountsResponse.data
            : []
        );

      } catch (error) {

        console.error(error);


        setError(
          error.response?.data?.message ||
          error.response?.data ||
          "Unable to load customer details"
        );

      } finally {

        setLoading(false);

      }

    };


  const openAccount =
    (accountNumber) => {

      navigate(
        `/admin/customers/${customerId}/accounts/${accountNumber}`
      );

    };


  if (loading) {

    return (

      <div className="admin-detail-message">

        Loading customer...

      </div>

    );

  }


  if (error) {

    return (

      <div className="customer-detail-page">


        <button
          type="button"
          className="admin-detail-back"
          onClick={() =>
            navigate(
              "/admin/customers"
            )
          }
        >

          <ArrowLeft size={18} />

          Back to Customers

        </button>


        <div className="admin-detail-error">

          {error}

        </div>


      </div>

    );

  }


  if (!customer) {

    return null;

  }


  return (

    <div className="customer-detail-page">


      <button

        type="button"

        className="admin-detail-back"

        onClick={() =>
          navigate(
            "/admin/customers"
          )
        }

      >

        <ArrowLeft size={18} />

        Back to Customers

      </button>



      {/* =========================
          CUSTOMER HEADER
      ========================= */}

      <section className="customer-detail-header">


        <div>


          <p className="customer-detail-eyebrow">

            Customer Details

          </p>


          <h1>

            {customer.firstName}{" "}
            {customer.lastName}

          </h1>


          <p className="muted">

            Customer ID #{customer.id}

          </p>


        </div>



        <span

          className={`customer-detail-status ${
            customer.status ===
            "ACTIVE"
              ? "active"
              : "inactive"
          }`}

        >

          {customer.status}

        </span>


      </section>



      {/* =========================
          CUSTOMER INFO
      ========================= */}

      <section className="customer-info-card card">


        <div className="customer-detail-card-title">

          <UserRound size={20} />

          <h2>
            Customer Information
          </h2>

        </div>



        <div className="customer-info-grid">


          <InfoItem

            icon={<Mail size={19} />}

            label="Email"

            value={
              customer.email
            }

          />


          <InfoItem

            icon={<Phone size={19} />}

            label="Phone"

            value={
              customer.phoneNumber
            }

          />


          <InfoItem

            icon={<MapPin size={19} />}

            label="Address"

            value={
              customer.address
            }

          />


          <InfoItem

            icon={
              <CalendarDays
                size={19}
              />
            }

            label="Joined"

            value={
              formatDate(
                customer.createdAt
              )
            }

          />


        </div>


      </section>



      {/* =========================
          BANK ACCOUNTS
      ========================= */}

      <section className="customer-bank-card card">


        <div className="customer-bank-header">


          <div>


            <div className="customer-detail-card-title">

              <Landmark size={20} />

              <h2>

                Bank Accounts

              </h2>

            </div>


            <p className="muted">

              Accounts belonging to this
              customer.

            </p>


          </div>


          <span className="customer-account-count">

            {accounts.length}{" "}

            {accounts.length === 1
              ? "Account"
              : "Accounts"}

          </span>


        </div>



        {accounts.length ===
        0 ? (

          <div className="customer-no-accounts">

            This customer does not have
            any bank accounts.

          </div>

        ) : (

          <div className="customer-accounts-list">


            {accounts.map(
              (account) => (

                <button

                  key={
                    account.accountNumber
                  }

                  type="button"

                  className="customer-account-row"

                  onClick={() =>
                    openAccount(
                      account.accountNumber
                    )
                  }

                >


                  <div className="customer-account-icon">

                    <Landmark
                      size={20}
                    />

                  </div>



                  <div className="customer-account-main">


                    <strong>

                      {account.accountType}

                    </strong>


                    <span>

                      Account{" "}
                      {account.accountNumber}

                    </span>


                  </div>



                  <div className="customer-account-balance">


                    <span className="muted">

                      Balance

                    </span>


                    <strong>

                      {formatCurrency(
                        account.balance
                      )}

                    </strong>


                  </div>



                  <span

                    className={`customer-account-status ${
                      account.status ===
                      "ACTIVE"
                        ? "active"
                        : "inactive"
                    }`}

                  >

                    {account.status}

                  </span>



                  <ChevronRight
                    size={20}
                    className="customer-account-arrow"
                  />


                </button>

              )
            )}


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

    <div className="customer-info-item">


      <div className="customer-info-icon">

        {icon}

      </div>


      <div>

        <span>

          {label}

        </span>


        <strong>

          {value || "—"}

        </strong>

      </div>


    </div>

  );
}



function formatCurrency(
  value
) {

  const number =
    Number(value || 0);


  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(number);

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