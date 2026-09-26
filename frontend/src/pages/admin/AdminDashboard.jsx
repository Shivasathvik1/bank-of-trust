import { useEffect, useMemo, useState } from "react";

import {
  Users,
  UserCheck,
  UserX,
  Landmark,
  ReceiptText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../../api/axios";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/customers"
      );

      setCustomers(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to load admin dashboard"
      );

    } finally {
      setLoading(false);
    }
  };


  const activeCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.status === "ACTIVE"
    ).length;
  }, [customers]);


  const inactiveCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.status === "INACTIVE"
    ).length;
  }, [customers]);


  const recentCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => {
        return new Date(b.createdAt) -
          new Date(a.createdAt);
      })
      .slice(0, 5);
  }, [customers]);


  if (loading) {
    return (
      <div className="admin-dashboard-loading card">
        Loading admin dashboard...
      </div>
    );
  }


  return (
    <div className="admin-dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="admin-dashboard-heading">

        <div>

          <p className="admin-dashboard-eyebrow">
            Administration
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p className="muted">
            Monitor and manage Bank of Trust customers,
            accounts, and transactions.
          </p>

        </div>


        <div className="admin-security-badge">

          <ShieldCheck size={18} />

          <span>
            Administrator
          </span>

        </div>

      </section>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="admin-dashboard-error">

          <span>
            {error}
          </span>

          <button
            className="btn btn-secondary"
            onClick={loadDashboard}
          >
            Retry
          </button>

        </div>
      )}


      {/* =========================
          STATS
      ========================= */}

      <section className="admin-stat-grid">

        <AdminStatCard
          title="Total Customers"
          value={customers.length}
          icon={<Users size={23} />}
          className="admin-stat-total"
        />


        <AdminStatCard
          title="Active Customers"
          value={activeCustomers}
          icon={<UserCheck size={23} />}
          className="admin-stat-active"
        />


        <AdminStatCard
          title="Inactive Customers"
          value={inactiveCustomers}
          icon={<UserX size={23} />}
          className="admin-stat-inactive"
        />

      </section>


      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <section>

        <div className="admin-section-heading">

          <div>

            <h2>
              Management
            </h2>

            <p className="muted">
              Access administrative tools.
            </p>

          </div>

        </div>


        <div className="admin-action-grid">

          <AdminActionCard
            to="/admin/customers"
            icon={<Users size={24} />}
            title="Customers"
            description="View customers and manage their account status."
          />


          <AdminActionCard
            to="/admin/accounts"
            icon={<Landmark size={24} />}
            title="Bank Accounts"
            description="View and manage customer bank accounts."
          />


          <AdminActionCard
            to="/admin/transactions"
            icon={<ReceiptText size={24} />}
            title="Transactions"
            description="Review banking transaction activity."
          />

        </div>

      </section>


      {/* =========================
          RECENT CUSTOMERS
      ========================= */}

      <section className="admin-recent-section card">

        <div className="admin-section-heading">

          <div>

            <h2>
              Recent Customers
            </h2>

            <p className="muted">
              Recently registered with Bank of Trust.
            </p>

          </div>


          <Link
            to="/admin/customers"
            className="admin-view-link"
          >
            View All

            <ArrowRight size={16} />
          </Link>

        </div>


        {recentCustomers.length === 0 ? (

          <div className="admin-empty">
            No customers found.
          </div>

        ) : (

          <div className="admin-customer-table-wrapper">

            <table className="admin-customer-table">

              <thead>

                <tr>

                  <th>
                    Customer
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Joined
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentCustomers.map(
                  (customer) => (

                    <tr key={customer.id}>

                      <td>

                        <div className="admin-customer-name">

                          <div className="admin-customer-avatar">

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

                        </div>

                      </td>


                      <td>
                        {customer.email || "—"}
                      </td>


                      <td>
                        {customer.phoneNumber || "—"}
                      </td>


                      <td>

                        <span
                          className={`admin-customer-status ${
                            customer.status === "ACTIVE"
                              ? "admin-customer-active"
                              : "admin-customer-inactive"
                          }`}
                        >
                          {customer.status || "UNKNOWN"}
                        </span>

                      </td>


                      <td>
                        {formatDate(
                          customer.createdAt
                        )}
                      </td>

                    </tr>

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


function AdminStatCard({
  title,
  value,
  icon,
  className,
}) {
  return (
    <div className="admin-stat-card card">

      <div
        className={`admin-stat-icon ${className}`}
      >
        {icon}
      </div>

      <div>

        <span className="muted">
          {title}
        </span>

        <h2>
          {value}
        </h2>

      </div>

    </div>
  );
}


function AdminActionCard({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="admin-action-card card"
    >

      <div className="admin-action-icon">
        {icon}
      </div>


      <div className="admin-action-content">

        <h3>
          {title}
        </h3>

        <p className="muted">
          {description}
        </p>

      </div>


      <ArrowRight
        className="admin-action-arrow"
        size={20}
      />

    </Link>
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


function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}