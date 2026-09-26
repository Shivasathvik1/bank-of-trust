import {
  LayoutDashboard,
  Users,
  Landmark,
  ReceiptText,
  LogOut,
  UserCog,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import ThemeToggle
  from "../ui/ThemeToggle";

import {
  useAuth,
} from "../../context/AuthContext";

import bankOfTrustLogo
  from "../../assets/bank-of-trust-logo.png";

import "./AdminLayout.css";


export default function AdminLayout() {

  const navigate =
    useNavigate();


  const {
    logout,
    email,
  } =
    useAuth();


  const handleLogout = () => {

    logout();

    navigate(
      "/login"
    );

  };


  return (

    <div className="admin-layout">


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">


        {/* =========================
            BRAND
        ========================= */}

        <div className="admin-brand">


          <div className="admin-logo">

            <img
              src={bankOfTrustLogo}
              alt="Bank of Trust"
            />

          </div>


          <div className="admin-brand-text">

            <h2>
              Bank of Trust
            </h2>

            <span>
              Administrator
            </span>

          </div>


        </div>



        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="admin-nav">


          <NavLink

            to="/admin"

            end

            aria-label="Dashboard"

            className={({
              isActive,
            }) =>
              `admin-link ${
                isActive
                  ? "admin-link-active"
                  : ""
              }`
            }

          >

            <LayoutDashboard
              size={20}
            />

            <span>
              Dashboard
            </span>

          </NavLink>



          <NavLink

            to="/admin/customers"

            aria-label="Customers"

            className={({
              isActive,
            }) =>
              `admin-link ${
                isActive
                  ? "admin-link-active"
                  : ""
              }`
            }

          >

            <Users
              size={20}
            />

            <span>
              Customers
            </span>

          </NavLink>



          <NavLink

            to="/admin/accounts"

            aria-label="Bank Accounts"

            className={({
              isActive,
            }) =>
              `admin-link ${
                isActive
                  ? "admin-link-active"
                  : ""
              }`
            }

          >

            <Landmark
              size={20}
            />

            <span>
              Bank Accounts
            </span>

          </NavLink>



          <NavLink

            to="/admin/transactions"

            aria-label="Transactions"

            className={({
              isActive,
            }) =>
              `admin-link ${
                isActive
                  ? "admin-link-active"
                  : ""
              }`
            }

          >

            <ReceiptText
              size={20}
            />

            <span>
              Transactions
            </span>

          </NavLink>



          <NavLink

            to="/admin/admins"

            aria-label="Administrators"

            className={({
              isActive,
            }) =>
              `admin-link ${
                isActive
                  ? "admin-link-active"
                  : ""
              }`
            }

          >

            <UserCog
              size={20}
            />

            <span>
              Administrators
            </span>

          </NavLink>


        </nav>



        {/* =========================
            SIDEBAR BOTTOM
        ========================= */}

        <div className="admin-sidebar-bottom">


          <div className="admin-user">


            <div className="admin-avatar">

              {email
                ? email
                    .charAt(0)
                    .toUpperCase()
                : "A"}

            </div>


            <div className="admin-user-info">

              <span>
                Administrator
              </span>

              <strong>
                {email || "Admin"}
              </strong>

            </div>


          </div>



          <button

            className="admin-logout"

            type="button"

            aria-label="Logout"

            onClick={
              handleLogout
            }

          >

            <LogOut
              size={18}
            />

            <span>
              Logout
            </span>

          </button>


        </div>


      </aside>



      {/* =========================
          MAIN
      ========================= */}

      <main className="admin-main">


        <header className="admin-topbar">


          <div className="admin-topbar-brand">

            <span className="admin-topbar-title">

              Bank of Trust

            </span>

            <span className="admin-topbar-divider">

              •

            </span>

            <span className="admin-topbar-portal">

              Admin Portal

            </span>

          </div>


          <ThemeToggle />


        </header>



        <div className="admin-content">

          <Outlet />

        </div>


      </main>


    </div>

  );

}