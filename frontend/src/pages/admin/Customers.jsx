import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../../api/axios";

import "./Customers.css";


export default function Customers() {

  const navigate =
    useNavigate();


  const [
    customers,
    setCustomers,
  ] =
    useState([]);


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    updatingId,
    setUpdatingId,
  ] =
    useState(null);


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

    loadCustomers();

  }, []);


  const loadCustomers =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await api.get(
            "/admin/customers"
          );


        setCustomers(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );

      } catch (error) {

        console.error(error);


        setError(
          error.response?.data?.message ||
          error.response?.data ||
          "Unable to load customers"
        );

      } finally {

        setLoading(false);

      }

    };


  const filteredCustomers =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {

        return customers;

      }


      return customers.filter(
        (customer) => {

          const fullName =
            `${customer.firstName || ""} ${customer.lastName || ""}`
              .toLowerCase();


          const email =
            String(
              customer.email || ""
            ).toLowerCase();


          const phone =
            String(
              customer.phoneNumber || ""
            ).toLowerCase();


          const id =
            String(
              customer.id || ""
            ).toLowerCase();


          const status =
            String(
              customer.status || ""
            ).toLowerCase();


          return (
            fullName.includes(query) ||
            email.includes(query) ||
            phone.includes(query) ||
            id.includes(query) ||
            status.includes(query)
          );

        }
      );

    }, [
      customers,
      search,
    ]);


  const updateStatus =
    async (
      customerId,
      newStatus
    ) => {

      try {

        setUpdatingId(
          customerId
        );

        setError("");

        setSuccess("");


        await api.put(
          `/admin/customers/${customerId}/status`,
          null,
          {
            params: {
              status: newStatus,
            },
          }
        );


        setCustomers(
          (
            currentCustomers
          ) =>
            currentCustomers.map(
              (customer) =>
                customer.id ===
                customerId
                  ? {
                      ...customer,
                      status:
                        newStatus,
                    }
                  : customer
            )
        );


        setSuccess(
          `Customer status changed to ${newStatus}`
        );

      } catch (error) {

        console.error(error);


        setError(
          error.response?.data?.message ||
          error.response?.data ||
          "Unable to update customer status"
        );

      } finally {

        setUpdatingId(null);

      }

    };


  const openCustomer =
    (customerId) => {

      navigate(
        `/admin/customers/${customerId}`
      );

    };


  return (

    <div className="admin-customers-page">


      <section className="admin-customers-heading">


        <div>

          <p className="admin-customers-eyebrow">

            Customer Management

          </p>


          <h1>

            Customers

          </h1>


          <p className="muted">

            View Bank of Trust customers and
            manage their access status.

          </p>

        </div>


      </section>



      {error && (

        <div className="admin-customers-error">

          {error}

        </div>

      )}



      {success && (

        <div className="admin-customers-success">

          {success}

        </div>

      )}



      <section className="admin-customer-controls card">


        <div className="admin-customer-search">

          <Search size={18} />


          <input

            type="text"

            placeholder="Search by name, email, phone, ID or status..."

            value={search}

            onChange={
              (event) =>
                setSearch(
                  event.target.value
                )
            }

          />

        </div>



        <div className="admin-customer-count">

          <span className="muted">
            Showing
          </span>

          <strong>
            {filteredCustomers.length}
          </strong>

          <span className="muted">
            of {customers.length}
          </span>

        </div>


      </section>



      <section className="admin-customers-card card">


        {loading ? (

          <div className="admin-customers-loading">

            Loading customers...

          </div>

        ) : filteredCustomers.length ===
          0 ? (

          <div className="admin-customers-empty">

            No customers found.

          </div>

        ) : (

          <div className="admin-customers-table-wrapper">


            <table className="admin-customers-table">


              <thead>

                <tr>

                  <th>Customer</th>

                  <th>Email</th>

                  <th>Phone</th>

                  <th>Address</th>

                  <th>Joined</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>



              <tbody>


                {filteredCustomers.map(
                  (customer) => (

                    <CustomerRow

                      key={
                        customer.id
                      }

                      customer={
                        customer
                      }

                      updating={
                        updatingId ===
                        customer.id
                      }

                      onUpdateStatus={
                        updateStatus
                      }

                      onOpenCustomer={
                        openCustomer
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



function CustomerRow({
  customer,
  updating,
  onUpdateStatus,
  onOpenCustomer,
}) {

  const isActive =
    customer.status ===
    "ACTIVE";


  return (

    <tr>


      {/* CUSTOMER */}

      <td>


        <button

          type="button"

          className="admin-customer-identity admin-customer-link"

          onClick={() =>
            onOpenCustomer(
              customer.id
            )
          }

        >


          <div className="admin-customer-row-avatar">

            {getInitials(
              customer.firstName,
              customer.lastName
            )}

          </div>


          <div>

            <strong>

              {customer.firstName}{" "}
              {customer.lastName}

            </strong>


            <span>

              ID #{customer.id}

            </span>

          </div>


        </button>


      </td>



      <td>

        {customer.email || "—"}

      </td>



      <td>

        {customer.phoneNumber || "—"}

      </td>



      <td className="admin-address-cell">

        {customer.address || "—"}

      </td>



      <td>

        {formatDate(
          customer.createdAt
        )}

      </td>



      <td>


        <span

          className={`admin-status-pill ${
            isActive
              ? "admin-status-active"
              : "admin-status-inactive"
          }`}

        >

          {customer.status ||
            "UNKNOWN"}

        </span>


      </td>



      <td>


        {isActive ? (

          <button

            type="button"

            className="admin-status-button deactivate"

            disabled={
              updating
            }

            onClick={() =>
              onUpdateStatus(
                customer.id,
                "INACTIVE"
              )
            }

          >

            <UserX size={16} />


            {updating
              ? "Updating..."
              : "Deactivate"}

          </button>

        ) : (

          <button

            type="button"

            className="admin-status-button activate"

            disabled={
              updating
            }

            onClick={() =>
              onUpdateStatus(
                customer.id,
                "ACTIVE"
              )
            }

          >

            <UserCheck size={16} />


            {updating
              ? "Updating..."
              : "Activate"}

          </button>

        )}


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