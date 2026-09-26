import {
  LayoutDashboard,
  WalletCards,
  ReceiptText,
  Send,
  User,
  LogOut,
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

import "./CustomerLayout.css";


export default function CustomerLayout() {

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

    <div className="customer-layout">


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="customer-sidebar">


        {/* BRAND */}

        <div className="sidebar-brand">


          <div className="sidebar-logo">

            <img
              src={bankOfTrustLogo}
              alt="Bank of Trust"
            />

          </div>


          <div className="sidebar-brand-text">

            <h2>
              Bank of Trust
            </h2>

            <span>
              Customer Banking
            </span>

          </div>


        </div>



        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="sidebar-nav">


          <NavLink

            to="/dashboard"

            aria-label="Dashboard"

            className={({
              isActive,
            }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
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

            to="/accounts"

            aria-label="Accounts"

            className={({
              isActive,
            }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
                  : ""
              }`
            }

          >

            <WalletCards
              size={20}
            />

            <span>
              Accounts
            </span>

          </NavLink>



          <NavLink

            to="/transactions"

            aria-label="Transactions"

            className={({
              isActive,
            }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
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

            to="/transfer"

            aria-label="Transfer Money"

            className={({
              isActive,
            }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
                  : ""
              }`
            }

          >

            <Send
              size={20}
            />

            <span>
              Transfer
            </span>

          </NavLink>



          <NavLink

            to="/profile"

            aria-label="Profile"

            className={({
              isActive,
            }) =>
              `sidebar-link ${
                isActive
                  ? "sidebar-link-active"
                  : ""
              }`
            }

          >

            <User
              size={20}
            />

            <span>
              Profile
            </span>

          </NavLink>


        </nav>



        {/* =========================
            SIDEBAR BOTTOM
        ========================= */}

        <div className="sidebar-bottom">


          <div className="sidebar-user">


            <div className="sidebar-user-avatar">

              {email
                ? email
                    .charAt(0)
                    .toUpperCase()
                : "U"}

            </div>


            <div className="sidebar-user-info">


              <span className="sidebar-user-label">

                Signed in

              </span>


              <strong>

                {email ||
                  "Customer"}

              </strong>


            </div>


          </div>



          <button

            type="button"

            className="sidebar-logout"

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

      <main className="customer-main">


        <header className="customer-topbar">


          <div className="customer-topbar-brand">


            <span className="topbar-title">

              Bank of Trust

            </span>


            <span className="topbar-divider">

              •

            </span>


            <span className="topbar-subtitle">

              A Brighter Tomorrow

            </span>


          </div>


          <ThemeToggle />


        </header>



        <div className="customer-content">

          <Outlet />

        </div>


      </main>


    </div>

  );

}