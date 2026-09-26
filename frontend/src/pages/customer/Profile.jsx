import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import api from "../../api/axios";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/customers/me"
      );

      setProfile(response.data);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading card">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-loading card">
        No profile found.
      </div>
    );
  }

  const initials =
    `${profile.firstName?.[0] || ""}${
      profile.lastName?.[0] || ""
    }`.toUpperCase();

  return (
    <div className="profile-page">

      <section className="profile-heading">

        <div>
          <p className="profile-eyebrow">
            Customer
          </p>

          <h1>
            My Profile
          </h1>

          <p className="muted">
            View your Bank of Trust customer information.
          </p>
        </div>

      </section>


      <section className="profile-layout">

        <aside className="profile-summary card">

          <div className="profile-avatar">
            {initials || <User size={30} />}
          </div>

          <h2>
            {profile.firstName}{" "}
            {profile.lastName}
          </h2>

          <p className="muted">
            {profile.email}
          </p>

          <div
            className={`profile-status ${
              profile.status === "ACTIVE"
                ? "profile-status-active"
                : "profile-status-inactive"
            }`}
          >
            <ShieldCheck size={16} />

            {profile.status}
          </div>

          <div className="profile-id">

            <span className="muted">
              Customer ID
            </span>

            <strong>
              {profile.id}
            </strong>

          </div>

        </aside>


        <section className="profile-details card">

          <div className="profile-details-header">

            <h2>
              Personal Information
            </h2>

            <p className="muted">
              Information associated with your account.
            </p>

          </div>


          <div className="profile-info-grid">

            <ProfileItem
              icon={<User size={20} />}
              label="First Name"
              value={profile.firstName}
            />

            <ProfileItem
              icon={<User size={20} />}
              label="Last Name"
              value={profile.lastName}
            />

            <ProfileItem
              icon={<Mail size={20} />}
              label="Email Address"
              value={profile.email}
            />

            <ProfileItem
              icon={<Phone size={20} />}
              label="Phone Number"
              value={profile.phoneNumber}
            />

            <ProfileItem
              icon={<MapPin size={20} />}
              label="Address"
              value={profile.address}
            />

            <ProfileItem
              icon={<CalendarDays size={20} />}
              label="Customer Since"
              value={formatDate(profile.createdAt)}
            />

          </div>

        </section>

      </section>

    </div>
  );
}


function ProfileItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="profile-item">

      <div className="profile-item-icon">
        {icon}
      </div>

      <div>
        <span className="muted">
          {label}
        </span>

        <strong>
          {value || "—"}
        </strong>
      </div>

    </div>
  );
}


function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}