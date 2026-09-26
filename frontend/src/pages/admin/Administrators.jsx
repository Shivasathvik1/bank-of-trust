import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Shield,
  UserCog,
  X,
  UserCheck,
  UserX,
} from "lucide-react";

import api
  from "../../api/axios";

import {
  getApiError,
} from "../../utils/apiError";

import "./Administrators.css";


export default function Administrators() {

  const [
    admins,
    setAdmins,
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


  const [
    showAddAdmin,
    setShowAddAdmin,
  ] =
    useState(false);


  const [
    updatingAdminId,
    setUpdatingAdminId,
  ] =
    useState(null);


  // =========================================
  // LOAD ADMINS
  // =========================================

  useEffect(() => {

    loadAdmins();

  }, []);


  const loadAdmins =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await api.get(
            "/admin/admins"
          );


        setAdmins(
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


  // =========================================
  // CHANGE ADMIN STATUS
  // =========================================

  const handleStatusChange =
    async (
      admin
    ) => {

      const currentStatus =
        admin.status;


      const newStatus =
        currentStatus === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";


      if (
        newStatus === "INACTIVE"
      ) {

        const confirmed =
          window.confirm(
            `Are you sure you want to deactivate ${admin.email}?`
          );


        if (!confirmed) {

          return;

        }

      }


      try {

        setUpdatingAdminId(
          admin.id
        );

        setError("");


        await api.put(
          `/admin/admins/${admin.id}/status`,
          null,
          {
            params: {
              status:
                newStatus,
            },
          }
        );


        await loadAdmins();

      } catch (error) {

        const apiError =
          getApiError(error);


        setError(
          apiError.message
        );

      } finally {

        setUpdatingAdminId(
          null
        );

      }

    };


  const activeAdminCount =
    admins.filter(
      (admin) =>
        admin.status === "ACTIVE"
    ).length;


  const inactiveAdminCount =
    admins.filter(
      (admin) =>
        admin.status === "INACTIVE"
    ).length;


  return (

    <div className="administrators-page">


      {/* =========================
          HEADER
      ========================= */}

      <section className="administrators-header">


        <div>

          <p className="administrators-eyebrow">

            Administration

          </p>


          <h1>

            Administrators

          </h1>


          <p className="muted">

            Manage users who have
            administrative access to
            Bank of Trust.

          </p>

        </div>



        <button

          type="button"

          className="btn btn-primary add-admin-button"

          onClick={() =>
            setShowAddAdmin(true)
          }

        >

          <Plus size={18} />

          Add Admin

        </button>


      </section>



      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <section className="administrators-summary">


        <div className="admin-summary-card card">


          <div className="admin-summary-icon">

            <Shield size={22} />

          </div>


          <div>

            <span className="muted">

              Total Administrators

            </span>

            <h2>

              {admins.length}

            </h2>

          </div>


        </div>



        <div className="admin-summary-card card">


          <div className="admin-summary-icon active">

            <UserCheck size={22} />

          </div>


          <div>

            <span className="muted">

              Active

            </span>

            <h2>

              {activeAdminCount}

            </h2>

          </div>


        </div>



        <div className="admin-summary-card card">


          <div className="admin-summary-icon inactive">

            <UserX size={22} />

          </div>


          <div>

            <span className="muted">

              Inactive

            </span>

            <h2>

              {inactiveAdminCount}

            </h2>

          </div>


        </div>


      </section>



      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div
          className="administrators-error"
          role="alert"
        >

          {error}

        </div>

      )}



      {/* =========================
          ADMIN TABLE
      ========================= */}

      <section className="administrators-card card">


        <div className="administrators-card-header">


          <div>

            <h2>

              Admin Users

            </h2>


            <p className="muted">

              Activate, deactivate,
              or create administrator
              accounts.

            </p>

          </div>


        </div>



        {loading ? (

          <div className="administrators-loading">

            Loading administrators...

          </div>

        ) : admins.length === 0 ? (

          <div className="administrators-empty">

            No administrators found.

          </div>

        ) : (

          <div className="administrators-table-wrapper">


            <table className="administrators-table">


              <thead>

                <tr>

                  <th>
                    Administrator
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    User ID
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>



              <tbody>


                {admins.map(
                  (admin) => (

                    <tr
                      key={
                        admin.id
                      }
                    >


                      {/* ADMIN */}

                      <td>

                        <div className="administrator-identity">


                          <div className="administrator-avatar">

                            {admin.email
                              ? admin.email
                                  .charAt(0)
                                  .toUpperCase()
                              : "A"}

                          </div>


                          <div>

                            <strong>

                              Administrator

                            </strong>


                            <span className="muted">

                              Bank of Trust Admin

                            </span>

                          </div>


                        </div>

                      </td>



                      {/* EMAIL */}

                      <td>

                        {admin.email}

                      </td>



                      {/* ROLE */}

                      <td>

                        <span className="administrator-role-badge">

                          <UserCog size={14} />

                          {admin.role}

                        </span>

                      </td>



                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            admin.status === "ACTIVE"
                              ? "administrator-status administrator-status-active"
                              : "administrator-status administrator-status-inactive"
                          }
                        >

                          {admin.status}

                        </span>

                      </td>



                      {/* ID */}

                      <td>

                        #{admin.id}

                      </td>



                      {/* ACTION */}

                      <td>

                        <button

                          type="button"

                          className={
                            admin.status === "ACTIVE"
                              ? "admin-status-button admin-deactivate-button"
                              : "admin-status-button admin-activate-button"
                          }

                          disabled={
                            updatingAdminId ===
                            admin.id
                          }

                          onClick={() =>
                            handleStatusChange(
                              admin
                            )
                          }

                        >

                          {updatingAdminId ===
                          admin.id
                            ? "Updating..."
                            : admin.status ===
                              "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}

                        </button>

                      </td>


                    </tr>

                  )
                )}


              </tbody>


            </table>


          </div>

        )}


      </section>



      {/* =========================
          ADD ADMIN MODAL
      ========================= */}

      {showAddAdmin && (

        <AddAdminModal

          onClose={() =>
            setShowAddAdmin(false)
          }

          onSuccess={
            loadAdmins
          }

        />

      )}


    </div>

  );
}



/* =========================================
   ADD ADMIN MODAL
========================================= */

function AddAdminModal({
  onClose,
  onSuccess,
}) {

  const [
    form,
    setForm,
  ] =
    useState({

      email: "",

      password: "",

      confirmPassword: "",

    });


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(false);



  const handleChange =
    (event) => {

      const {
        name,
        value,
      } =
        event.target;


      setForm(
        (current) => ({

          ...current,

          [name]: value,

        })
      );


      setError("");

    };



  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (
        !form.email.trim()
      ) {

        setError(
          "Email is required."
        );

        return;

      }


      if (
        form.password.length < 8
      ) {

        setError(
          "Password must be at least 8 characters."
        );

        return;

      }


      if (
        form.password !==
        form.confirmPassword
      ) {

        setError(
          "Passwords do not match."
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        await api.post(
          "/admin/admins",
          {

            email:
              form.email
                .trim()
                .toLowerCase(),

            password:
              form.password,

          }
        );


        await onSuccess();


        onClose();

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


  return (

    <div className="admin-modal-backdrop">


      <div

        className="admin-create-modal card"

        role="dialog"

        aria-modal="true"

        aria-labelledby="add-admin-title"

      >


        <div className="admin-create-modal-header">


          <div>

            <h2 id="add-admin-title">

              Add Administrator

            </h2>


            <p className="muted">

              Create a new Bank of Trust
              administrator account.

            </p>

          </div>



          <button

            type="button"

            className="admin-modal-close"

            onClick={onClose}

            aria-label="Close add administrator dialog"

          >

            <X size={20} />

          </button>


        </div>



        {error && (

          <div
            className="admin-create-error"
            role="alert"
          >

            {error}

          </div>

        )}



        <form
          onSubmit={
            handleSubmit
          }
        >


          <label
            htmlFor="admin-email"
          >

            Email Address

          </label>


          <input

            id="admin-email"

            className="form-input"

            type="email"

            name="email"

            value={
              form.email
            }

            onChange={
              handleChange
            }

            placeholder="admin@bankoftrust.com"

            autoComplete="email"

            required

          />



          <label
            htmlFor="admin-password"
          >

            Password

          </label>


          <input

            id="admin-password"

            className="form-input"

            type="password"

            name="password"

            value={
              form.password
            }

            onChange={
              handleChange
            }

            placeholder="Minimum 8 characters"

            autoComplete="new-password"

            required

          />



          <label
            htmlFor="admin-confirm-password"
          >

            Confirm Password

          </label>


          <input

            id="admin-confirm-password"

            className="form-input"

            type="password"

            name="confirmPassword"

            value={
              form.confirmPassword
            }

            onChange={
              handleChange
            }

            placeholder="Re-enter password"

            autoComplete="new-password"

            required

          />



          <div className="admin-create-actions">


            <button

              type="button"

              className="btn btn-secondary"

              onClick={onClose}

              disabled={loading}

            >

              Cancel

            </button>



            <button

              type="submit"

              className="btn btn-primary"

              disabled={loading}

            >

              {loading
                ? "Creating..."
                : "Create Admin"}

            </button>


          </div>


        </form>


      </div>


    </div>

  );
}