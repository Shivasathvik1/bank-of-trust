import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Landmark,
  Plus,
  Search,
  X,
  ChevronRight,
  WalletCards,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../../api/axios";

import {
  getApiError,
} from "../../utils/apiError";

import "./BankAccounts.css";


export default function BankAccounts() {

  const navigate =
    useNavigate();


  const [
    accounts,
    setAccounts,
  ] =
    useState([]);


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
    creating,
    setCreating,
  ] =
    useState(false);


  /*
   * Page-level errors.
   *
   * These are for loading the page,
   * not for the Create Account modal.
   */
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


  const [
    showCreateModal,
    setShowCreateModal,
  ] =
    useState(false);


  /*
   * Modal-specific error.
   *
   * This fixes TL-07.
   */
  const [
    createError,
    setCreateError,
  ] =
    useState("");


  /*
   * Backend or frontend validation
   * errors for individual fields.
   */
  const [
    createFieldErrors,
    setCreateFieldErrors,
  ] =
    useState({});


  const [
    newAccount,
    setNewAccount,
  ] =
    useState({
      customerId: "",
      accountNumber: "",
      accountType: "CHECKING",
      balance: "",
    });


  // =========================================
  // LOAD PAGE
  // =========================================

  useEffect(() => {

    loadPage();

  }, []);


  const loadPage =
    async () => {

      try {

        setLoading(true);

        setError("");


        const [
          accountsResponse,
          customersResponse,
        ] =
          await Promise.all([

            api.get(
              "/admin/accounts"
            ),

            api.get(
              "/admin/customers"
            ),

          ]);


        setAccounts(
          Array.isArray(
            accountsResponse.data
          )
            ? accountsResponse.data
            : []
        );


        setCustomers(
          Array.isArray(
            customersResponse.data
          )
            ? customersResponse.data
            : []
        );

      } catch (error) {

        const apiError =
          getApiError(error);


        setError(
          apiError.message ||
          "Unable to load bank accounts."
        );

      } finally {

        setLoading(false);

      }

    };


  // =========================================
  // SEARCH / FILTER
  // =========================================

  const filteredAccounts =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {

        return accounts;

      }


      return accounts.filter(
        (account) => {

          const fullName =
            `${account.firstName || ""} ${account.lastName || ""}`
              .toLowerCase();


          return (

            String(
              account.accountNumber || ""
            )
              .toLowerCase()
              .includes(query)

            ||

            String(
              account.accountType || ""
            )
              .toLowerCase()
              .includes(query)

            ||

            String(
              account.status || ""
            )
              .toLowerCase()
              .includes(query)

            ||

            String(
              account.email || ""
            )
              .toLowerCase()
              .includes(query)

            ||

            fullName.includes(
              query
            )

          );

        }
      );

    }, [
      accounts,
      search,
    ]);


  // =========================================
  // ACTIVE CUSTOMERS
  // =========================================

  const activeCustomers =
    useMemo(() => {

      return customers.filter(
        (customer) =>
          customer.status ===
          "ACTIVE"
      );

    }, [customers]);


  // =========================================
  // OPEN CREATE MODAL
  // =========================================

  const openCreateModal =
    () => {

      setError("");

      setSuccess("");

      setCreateError("");

      setCreateFieldErrors({});


      setNewAccount({
        customerId: "",
        accountNumber: "",
        accountType: "CHECKING",
        balance: "",
      });


      setShowCreateModal(
        true
      );

    };


  // =========================================
  // CLOSE CREATE MODAL
  // =========================================

  const closeCreateModal =
    () => {

      if (creating) {

        return;

      }


      setShowCreateModal(
        false
      );


      setCreateError("");

      setCreateFieldErrors({});

    };


  // =========================================
  // UPDATE CREATE FORM FIELD
  // =========================================

  const updateCreateField =
    (
      name,
      value
    ) => {

      setNewAccount(
        (current) => ({
          ...current,
          [name]: value,
        })
      );


      /*
       * Remove the field's old error
       * as soon as the user edits it.
       */
      setCreateFieldErrors(
        (current) => ({
          ...current,
          [name]: "",
        })
      );


      setCreateError("");

    };


  // =========================================
  // CREATE ACCOUNT
  // =========================================

  const createAccount =
    async (event) => {

      event.preventDefault();


      setCreateError("");

      setCreateFieldErrors({});


      const validationErrors =
        {};


      // -----------------------------
      // CUSTOMER
      // -----------------------------

      if (
        !newAccount.customerId
      ) {

        validationErrors.customerId =
          "Please select a customer.";

      }


      // -----------------------------
      // ACCOUNT NUMBER
      // -----------------------------

      const cleanedAccountNumber =
        newAccount.accountNumber
          .trim();


      if (
        !cleanedAccountNumber
      ) {

        validationErrors.accountNumber =
          "Account number is required.";

      } else if (
        !/^\d+$/.test(
          cleanedAccountNumber
        )
      ) {

        validationErrors.accountNumber =
          "Account number must contain digits only.";

      } else if (
        Number(
          cleanedAccountNumber
        ) <= 0
      ) {

        validationErrors.accountNumber =
          "Account number must be greater than zero.";

      }


      // -----------------------------
      // OPENING BALANCE
      // -----------------------------

      const cleanedBalance =
        String(
          newAccount.balance
        ).trim();


      if (
        cleanedBalance === ""
      ) {

        validationErrors.balance =
          "Opening balance is required.";

      } else if (
        !/^\d+(\.\d{1,2})?$/.test(
          cleanedBalance
        )
      ) {

        validationErrors.balance =
          "Opening balance can have at most 2 decimal places.";

      } else if (
        Number(
          cleanedBalance
        ) < 0
      ) {

        validationErrors.balance =
          "Opening balance cannot be negative.";

      } else if (
        Number(
          cleanedBalance
        ) >
        9999999999999.99
      ) {

        validationErrors.balance =
          "Opening balance is too large.";

      }


      // -----------------------------
      // STOP IF FRONTEND ERRORS
      // -----------------------------

      if (
        Object.keys(
          validationErrors
        ).length > 0
      ) {

        setCreateFieldErrors(
          validationErrors
        );


        setCreateError(
          "Please correct the highlighted fields."
        );


        return;

      }


      // -----------------------------
      // API REQUEST
      // -----------------------------

      try {

        setCreating(true);

        setCreateError("");

        setSuccess("");


        await api.post(

          `/admin/customers/${newAccount.customerId}/accounts`,

          {

            /*
             * Keeping your existing numeric
             * account-number behavior because
             * TL-02 was intentionally deferred.
             */
            accountNumber:
              Number(
                cleanedAccountNumber
              ),

            accountType:
              newAccount.accountType,

            balance:
              Number(
                cleanedBalance
              ),

            status:
              "ACTIVE",

          }

        );


        setSuccess(
          "Bank account created successfully."
        );


        setShowCreateModal(
          false
        );


        setCreateError("");

        setCreateFieldErrors({});


        setNewAccount({
          customerId: "",
          accountNumber: "",
          accountType: "CHECKING",
          balance: "",
        });


        await loadPage();

      } catch (error) {

        const apiError =
          getApiError(error);


        /*
         * TL-07 FIX:
         *
         * Keep account-creation errors
         * inside the open modal.
         */
        setCreateError(
          apiError.message ||
          "Unable to create bank account."
        );


        setCreateFieldErrors(
          apiError.fieldErrors || {}
        );

      } finally {

        setCreating(false);

      }

    };


  // =========================================
  // OPEN ACCOUNT
  // =========================================

  const openAccount =
    (accountNumber) => {

      navigate(
        `/admin/accounts/${accountNumber}`
      );

    };


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="admin-bank-page">


      {/* HEADER */}

      <section className="admin-bank-header">


        <div>

          <p className="admin-bank-eyebrow">

            Account Management

          </p>


          <h1>

            Bank Accounts

          </h1>


          <p className="muted">

            View and manage all Bank of Trust
            bank accounts.

          </p>

        </div>


        <button

          type="button"

          className="btn btn-primary admin-create-bank-button"

          onClick={
            openCreateModal
          }

        >

          <Plus size={18} />

          Create Bank Account

        </button>


      </section>



      {/* PAGE ALERTS */}

      {error && (

        <div
          className="admin-bank-error"
          role="alert"
        >

          {error}

        </div>

      )}


      {success && (

        <div
          className="admin-bank-success"
          role="status"
        >

          {success}

        </div>

      )}



      {/* SEARCH */}

      <section className="admin-bank-toolbar card">


        <div className="admin-bank-search">


          <Search size={18} />


          <input

            type="text"

            aria-label="Search bank accounts"

            placeholder="Search by account number, customer, email, type or status..."

            value={search}

            onChange={
              (event) =>
                setSearch(
                  event.target.value
                )
            }

          />


        </div>


        <div className="admin-bank-count">


          <span className="muted">

            Showing

          </span>


          <strong>

            {filteredAccounts.length}

          </strong>


          <span className="muted">

            of {accounts.length}

          </span>


        </div>


      </section>



      {/* ACCOUNT LIST */}

      <section className="admin-bank-list-card card">


        <div className="admin-bank-list-heading">


          <div>

            <h2>

              All Bank Accounts

            </h2>


            <p className="muted">

              Click an account to view
              customer information and
              transaction history.

            </p>

          </div>


          <span className="admin-bank-total-badge">

            {accounts.length}

            {" "}

            {accounts.length === 1
              ? "Account"
              : "Accounts"}

          </span>


        </div>



        {loading ? (

          <div className="admin-bank-loading">

            Loading bank accounts...

          </div>

        ) : filteredAccounts.length ===
          0 ? (

          <div className="admin-bank-empty">


            <Landmark size={32} />


            <h3>

              No bank accounts found

            </h3>


            <p className="muted">

              Try changing your search
              or create a new account.

            </p>


          </div>

        ) : (

          <div className="admin-bank-table-wrapper">


            <table className="admin-bank-table">


              <thead>

                <tr>

                  <th>
                    Account
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Balance
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Customer Status
                  </th>

                  <th></th>

                </tr>

              </thead>



              <tbody>


                {filteredAccounts.map(
                  (account) => (

                    <tr

                      key={
                        account.accountNumber
                      }

                      className="admin-bank-row"

                      tabIndex={0}

                      role="button"

                      onClick={() =>
                        openAccount(
                          account.accountNumber
                        )
                      }

                      onKeyDown={
                        (event) => {

                          if (
                            event.key ===
                              "Enter" ||
                            event.key ===
                              " "
                          ) {

                            event.preventDefault();

                            openAccount(
                              account.accountNumber
                            );

                          }

                        }
                      }

                    >


                      {/* ACCOUNT */}

                      <td>


                        <div className="admin-bank-account-cell">


                          <div className="admin-bank-account-icon">

                            <Landmark
                              size={19}
                            />

                          </div>


                          <div>

                            <strong>

                              {
                                account.accountNumber
                              }

                            </strong>


                            <span>

                              Bank Account

                            </span>

                          </div>


                        </div>


                      </td>



                      {/* CUSTOMER */}

                      <td>


                        <div className="admin-bank-customer-cell">


                          <strong>

                            {account.firstName}{" "}
                            {account.lastName}

                          </strong>


                          <span>

                            {account.email ||
                              "—"}

                          </span>


                        </div>


                      </td>



                      {/* TYPE */}

                      <td>

                        <span className="admin-bank-type">

                          <WalletCards
                            size={14}
                          />

                          {
                            account.accountType
                          }

                        </span>

                      </td>



                      {/* BALANCE */}

                      <td>

                        <strong className="admin-bank-balance">

                          {formatCurrency(
                            account.balance
                          )}

                        </strong>

                      </td>



                      {/* ACCOUNT STATUS */}

                      <td>


                        <StatusBadge

                          status={
                            account.status
                          }

                        />


                      </td>



                      {/* CUSTOMER STATUS */}

                      <td>


                        <StatusBadge

                          status={
                            account.customerStatus
                          }

                        />


                      </td>



                      <td>


                        <ChevronRight
                          size={18}
                          className="admin-bank-chevron"
                        />


                      </td>


                    </tr>

                  )
                )}


              </tbody>


            </table>


          </div>

        )}


      </section>



      {/* CREATE MODAL */}

      {showCreateModal && (

        <CreateAccountModal

          customers={
            activeCustomers
          }

          form={
            newAccount
          }

          fieldErrors={
            createFieldErrors
          }

          error={
            createError
          }

          loading={
            creating
          }

          onChange={
            updateCreateField
          }

          onSubmit={
            createAccount
          }

          onClose={
            closeCreateModal
          }

        />

      )}


    </div>

  );

}



// =========================================
// STATUS BADGE
// =========================================

function StatusBadge({
  status,
}) {

  const normalized =
    String(
      status || "UNKNOWN"
    ).toLowerCase();


  return (

    <span
      className={`admin-bank-status admin-bank-status-${normalized}`}
    >

      {status || "UNKNOWN"}

    </span>

  );

}



// =========================================
// CREATE ACCOUNT MODAL
// =========================================

function CreateAccountModal({
  customers,
  form,
  fieldErrors,
  error,
  loading,
  onChange,
  onSubmit,
  onClose,
}) {

  return (

    <div
      className="admin-bank-modal-backdrop"
      onMouseDown={
        (event) => {

          if (
            event.target ===
            event.currentTarget &&
            !loading
          ) {

            onClose();

          }

        }
      }
    >


      <div

        className="admin-bank-modal card"

        role="dialog"

        aria-modal="true"

        aria-labelledby="create-bank-account-title"

      >


        <div className="admin-bank-modal-header">


          <div>

            <p className="admin-bank-modal-eyebrow">

              Account Management

            </p>


            <h2 id="create-bank-account-title">

              Create Bank Account

            </h2>


            <p className="muted">

              Select an active customer
              and create a new account.

            </p>

          </div>



          <button

            type="button"

            className="admin-bank-modal-close"

            onClick={
              onClose
            }

            aria-label="Close create bank account modal"

            disabled={
              loading
            }

          >

            <X size={20} />

          </button>


        </div>



        {/* TL-07: ERROR INSIDE MODAL */}

        {error && (

          <div
            className="admin-bank-modal-error"
            role="alert"
          >

            {error}

          </div>

        )}



        <form
          onSubmit={
            onSubmit
          }
        >


          {/* CUSTOMER */}

          <div className="admin-bank-form-group">


            <label
              htmlFor="bank-customer"
            >

              Customer

            </label>


            <select

              id="bank-customer"

              className={`form-input ${
                fieldErrors.customerId
                  ? "input-error"
                  : ""
              }`}

              value={
                form.customerId
              }

              onChange={
                (event) =>
                  onChange(
                    "customerId",
                    event.target.value
                  )
              }

              required

              aria-invalid={
                Boolean(
                  fieldErrors.customerId
                )
              }

            >


              <option value="">

                Select customer

              </option>


              {customers.map(
                (customer) => (

                  <option

                    key={
                      customer.id
                    }

                    value={
                      customer.id
                    }

                  >

                    {customer.firstName}{" "}
                    {customer.lastName}

                    {" — "}

                    {customer.email}

                  </option>

                )
              )}


            </select>


            {fieldErrors.customerId && (

              <span className="field-error-message">

                {
                  fieldErrors.customerId
                }

              </span>

            )}


          </div>



          <div className="admin-bank-modal-grid">


            {/* ACCOUNT NUMBER */}

            <div className="admin-bank-form-group">


              <label
                htmlFor="bank-account-number"
              >

                Account Number

              </label>


              <input

                id="bank-account-number"

                className={`form-input ${
                  fieldErrors.accountNumber
                    ? "input-error"
                    : ""
                }`}

                type="text"

                inputMode="numeric"

                placeholder="e.g. 20005"

                value={
                  form.accountNumber
                }

                onChange={
                  (event) =>
                    onChange(
                      "accountNumber",
                      event.target.value
                    )
                }

                required

                aria-invalid={
                  Boolean(
                    fieldErrors.accountNumber
                  )
                }

              />


              {fieldErrors.accountNumber && (

                <span className="field-error-message">

                  {
                    fieldErrors.accountNumber
                  }

                </span>

              )}


            </div>



            {/* ACCOUNT TYPE */}

            <div className="admin-bank-form-group">


              <label
                htmlFor="bank-account-type"
              >

                Account Type

              </label>


              <select

                id="bank-account-type"

                className="form-input"

                value={
                  form.accountType
                }

                onChange={
                  (event) =>
                    onChange(
                      "accountType",
                      event.target.value
                    )
                }

              >


                <option value="CHECKING">

                  CHECKING

                </option>


                <option value="SAVINGS">

                  SAVINGS

                </option>


              </select>


            </div>



            {/* OPENING BALANCE */}

            <div className="admin-bank-form-group full">


              <label
                htmlFor="bank-opening-balance"
              >

                Opening Balance

              </label>


              <div className="admin-bank-money-input">


                <span>
                  $
                </span>


                <input

                  id="bank-opening-balance"

                  className={`form-input ${
                    fieldErrors.balance
                      ? "input-error"
                      : ""
                  }`}

                  type="number"

                  min="0"

                  max="9999999999999.99"

                  step="0.01"

                  placeholder="0.00"

                  value={
                    form.balance
                  }

                  onChange={
                    (event) =>
                      onChange(
                        "balance",
                        event.target.value
                      )
                  }

                  required

                  aria-invalid={
                    Boolean(
                      fieldErrors.balance
                    )
                  }

                />


              </div>


              {fieldErrors.balance && (

                <span className="field-error-message">

                  {
                    fieldErrors.balance
                  }

                </span>

              )}


              <span className="admin-bank-balance-help">

                Opening balance may be $0.00.

              </span>


            </div>


          </div>



          <div className="admin-bank-modal-actions">


            <button

              type="button"

              className="btn btn-secondary"

              onClick={
                onClose
              }

              disabled={
                loading
              }

            >

              Cancel

            </button>


            <button

              type="submit"

              className="btn btn-primary"

              disabled={
                loading ||
                customers.length === 0
              }

            >

              <Plus size={17} />


              {loading
                ? "Creating..."
                : "Create Account"}

            </button>


          </div>


        </form>


      </div>


    </div>

  );

}



// =========================================
// FORMAT CURRENCY
// =========================================

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