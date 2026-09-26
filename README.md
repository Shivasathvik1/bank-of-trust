# Bank of Trust

### A Brighter Tomorrow

Bank of Trust is a full-stack banking application built as a portfolio project to demonstrate practical Java, Spring Boot, Spring Security, REST API, database, testing, and React development skills.

The application supports both customer and administrator workflows, including secure authentication, account management, transfers, deposits, withdrawals, transaction history, customer administration, and account status management.

> This project is for educational and portfolio purposes only. It is not a real banking service and should not be used for real financial transactions.

---

## Features

### Customer Features

- User registration and login
- JWT-based authentication
- View personal banking dashboard
- View bank accounts
- View account details
- Deposit money
- Withdraw money
- Transfer money between accounts
- View transaction history
- Filter transactions by type and date
- View personal profile
- Light and dark theme support

### Administrator Features

- Admin authentication and authorization
- View all customers
- View individual customer details
- Activate and deactivate customers
- View all bank accounts
- Create bank accounts for customers
- View individual account details
- Block or activate bank accounts
- View all transactions
- Filter and paginate transactions
- View customer-specific transactions
- View account-specific transactions
- Manage administrator-facing banking data

---

## Tech Stack

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Jakarta Validation
- JUnit 5
- Mockito

### Frontend

- React
- Vite
- React Router
- Axios
- Lucide React
- CSS
- Responsive UI
- Light / Dark Theme

---

## Project Architecture

The project follows a layered architecture.

```text
Frontend
   |
   | HTTP / REST API
   v
Controller
   |
   v
Service
   |
   v
Repository
   |
   v
MySQL Database