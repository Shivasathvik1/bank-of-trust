import {
  ArrowRight,
  ShieldCheck,
  Smartphone,
  WalletCards,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import ThemeToggle
  from "../../components/ui/ThemeToggle";

import bankOfTrustLogo
  from "../../assets/bank-of-trust-logo.png";

import "./Home.css";


export default function Home() {

  return (

    <div className="home">


      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="home-nav">


        <Link
          to="/"
          className="home-brand"
        >

          <div className="home-brand-logo">

            <img
              src={bankOfTrustLogo}
              alt="Bank of Trust"
            />

          </div>


          <div className="home-brand-text">

            <strong>
              Bank of Trust
            </strong>

            <span>
              A Brighter Tomorrow
            </span>

          </div>

        </Link>



        <div className="home-nav-actions">

          <ThemeToggle />


          <Link
            to="/login"
            className="login-link"
          >

            Login

          </Link>


          <Link
            to="/register"
            className="btn btn-primary"
          >

            Open Account

          </Link>

        </div>


      </nav>



      <main>


        {/* =========================
            HERO
        ========================= */}

        <section className="hero">


          <div className="hero-content">


            <div className="hero-badge">

              <ShieldCheck size={16} />

              Secure digital banking

            </div>


            <h1>

              Banking built for

              <span>
                {" "}clarity and control.
              </span>

            </h1>


            <p>

              Bank of Trust gives you a secure
              place to manage your accounts,
              transfer money, and track every
              transaction from one modern
              banking platform.

            </p>


            <div className="hero-buttons">


              <Link
                to="/register"
                className="btn btn-primary hero-primary"
              >

                Get Started

                <ArrowRight size={18} />

              </Link>


              <Link
                to="/login"
                className="btn btn-secondary"
              >

                Sign In

              </Link>


            </div>



            <div className="hero-trust">


              <span>

                <ShieldCheck size={18} />

                Secure authentication

              </span>


              <span>

                <WalletCards size={18} />

                Account management

              </span>


            </div>


          </div>



          {/* =========================
              DEMO BANK CARD
          ========================= */}

          <div className="hero-demo-card">


            <div className="demo-bank-label">

              BANK OF TRUST

            </div>


            <div className="demo-header">


              <div>

                <span className="muted">

                  Total Balance

                </span>


                <h2>

                  $12,450.75

                </h2>

              </div>


              <div className="demo-avatar">

                GK

              </div>


            </div>



            <div className="demo-account">


              <div>

                <span className="muted">

                  Checking Account

                </span>


                <strong>

                  •••• 10001

                </strong>

              </div>


              <strong>

                $8,450.25

              </strong>


            </div>



            <div className="demo-account">


              <div>

                <span className="muted">

                  Savings Account

                </span>


                <strong>

                  •••• 10002

                </strong>

              </div>


              <strong>

                $4,000.50

              </strong>


            </div>



            <div className="demo-transactions">


              <h4>

                Recent activity

              </h4>


              <div className="transaction-row">


                <div>

                  <strong>

                    Salary Deposit

                  </strong>


                  <span className="muted">

                    Today

                  </span>

                </div>


                <strong className="positive">

                  +$1,000.00

                </strong>


              </div>



              <div className="transaction-row">


                <div>

                  <strong>

                    Transfer

                  </strong>


                  <span className="muted">

                    Yesterday

                  </span>

                </div>


                <strong className="negative">

                  -$250.00

                </strong>


              </div>


            </div>


          </div>


        </section>



        {/* =========================
            FEATURES
        ========================= */}

        <section className="features">


          <Feature

            icon={
              <ShieldCheck />
            }

            title="Secure by design"

            text="JWT authentication, role-based access, and protected banking operations."

          />


          <Feature

            icon={
              <WalletCards />
            }

            title="Control your money"

            text="Manage accounts, balances, deposits, withdrawals, and transfers from one place."

          />


          <Feature

            icon={
              <Smartphone />
            }

            title="Built for every screen"

            text="A clean responsive banking experience across desktop, tablet, and mobile."

          />


        </section>


      </main>


    </div>

  );

}



function Feature({
  icon,
  title,
  text,
}) {

  return (

    <div className="feature-card card">


      <div className="feature-icon">

        {icon}

      </div>


      <h3>

        {title}

      </h3>


      <p className="muted">

        {text}

      </p>


    </div>

  );

}