import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import Home
  from "./pages/public/Home";

import Login
  from "./pages/public/Login";

import Register
  from "./pages/public/Register";


import Dashboard
  from "./pages/customer/Dashboard";

import Accounts
  from "./pages/customer/Accounts";

import AccountDetails
  from "./pages/customer/AccountDetails";

import Transactions
  from "./pages/customer/Transactions";

import Transfer
  from "./pages/customer/Transfer";

import Profile
  from "./pages/customer/Profile";


import AdminDashboard
  from "./pages/admin/AdminDashboard";

import Customers
  from "./pages/admin/Customers";

import CustomerDetails
  from "./pages/admin/CustomerDetails";

import AdminAccountDetails
  from "./pages/admin/AdminAccountDetails";

import BankAccounts
  from "./pages/admin/BankAccounts";

import AdminTransactions
  from "./pages/admin/AdminTransactions";

import Administrators
  from "./pages/admin/Administrators";


import CustomerLayout
  from "./components/layout/CustomerLayout";

import AdminLayout
  from "./components/layout/AdminLayout";


import ProtectedRoute
  from "./routes/ProtectedRoute";

import AdminRoute
  from "./routes/AdminRoute";


export default function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =========================
            PUBLIC
        ========================= */}

        <Route
          path="/"
          element={
            <Home />
          }
        />


        <Route
          path="/login"
          element={
            <Login />
          }
        />


        <Route
          path="/register"
          element={
            <Register />
          }
        />



        {/* =========================
            CUSTOMER
        ========================= */}

        <Route

          element={

            <ProtectedRoute>

              <CustomerLayout />

            </ProtectedRoute>

          }

        >


          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />


          <Route
            path="/accounts"
            element={
              <Accounts />
            }
          />


          <Route
            path="/accounts/:accountNumber"
            element={
              <AccountDetails />
            }
          />


          <Route
            path="/transactions"
            element={
              <Transactions />
            }
          />


          <Route
            path="/transfer"
            element={
              <Transfer />
            }
          />


          <Route
            path="/profile"
            element={
              <Profile />
            }
          />


        </Route>



        {/* =========================
            ADMIN
        ========================= */}

        <Route

          element={

            <AdminRoute>

              <AdminLayout />

            </AdminRoute>

          }

        >


          <Route
            path="/admin"
            element={
              <AdminDashboard />
            }
          />


          {/* CUSTOMERS */}

          <Route
            path="/admin/customers"
            element={
              <Customers />
            }
          />


          <Route
            path="/admin/customers/:customerId"
            element={
              <CustomerDetails />
            }
          />


          {/* ACCOUNT FROM CUSTOMER DETAILS */}

          <Route
            path="/admin/customers/:customerId/accounts/:accountNumber"
            element={
              <AdminAccountDetails />
            }
          />


          {/* ALL BANK ACCOUNTS */}

          <Route
            path="/admin/accounts"
            element={
              <BankAccounts />
            }
          />


          {/* GLOBAL BANK ACCOUNT DETAILS */}

          <Route
            path="/admin/accounts/:accountNumber"
            element={
              <AdminAccountDetails />
            }
          />


          {/* TRANSACTIONS */}

          <Route
            path="/admin/transactions"
            element={
              <AdminTransactions />
            }
          />


          {/* ADMINISTRATORS */}

          <Route
            path="/admin/admins"
            element={
              <Administrators />
            }
          />


        </Route>



        {/* =========================
            FALLBACK
        ========================= */}

        <Route

          path="*"

          element={

            <Navigate
              to="/"
              replace
            />

          }

        />


      </Routes>

    </BrowserRouter>

  );
}