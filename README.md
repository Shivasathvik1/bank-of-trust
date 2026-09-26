# Bank of Trust

### A Brighter Tomorrow

Bank of Trust is a full-stack banking application built as a portfolio project to demonstrate practical Java, Spring Boot, Spring Security, REST API, database, testing, deployment, and React development skills.

The application supports both customer and administrator workflows, including secure authentication, account management, transfers, deposits, withdrawals, transaction history, customer administration, and account status management.

> This project is for educational and portfolio purposes only. It is not a real banking service and should not be used for real financial transactions.

---

## Live Demo

**Frontend:**  
https://bank-of-trust.pages.dev

**Backend API:**  
https://bankoftrust.duckdns.org

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

- Java 21
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

### Deployment

- Oracle Cloud Infrastructure
- Oracle Linux
- Nginx
- Let's Encrypt / Certbot
- Cloudflare Pages
- systemd
- MySQL

---

## Project Architecture

The project follows a layered architecture.

```text
React Frontend
    |
    | HTTPS / REST API
    v
Nginx Reverse Proxy
    |
    v
Spring Boot Backend
    |
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
```

---

## Security

- Spring Security
- JWT-based authentication
- Role-based authorization for `CUSTOMER` and `ADMIN`
- BCrypt password hashing
- Protected REST API endpoints
- CORS restricted to trusted frontend origins
- Database credentials supplied through environment configuration
- JWT signing secret supplied through environment configuration
- HTTPS enabled for the deployed backend

---

## Testing

The backend includes unit tests covering major service and security workflows.

Current test result:

```text
Tests run: 45
Failures: 0
Errors: 0
Skipped: 0
```

Testing includes:

- Authentication
- Customer management
- Bank account management
- Transfers
- Deposits
- Withdrawals
- Transaction validation
- Authorization rules
- Transaction rollback behavior

---

## Local Setup

### Prerequisites

Install:

- Java 21
- MySQL 8+
- Node.js
- Git

### Clone the Repository

```bash
git clone https://github.com/Shivasathvik1/bank-of-trust.git
cd bank-of-trust
```

### Backend Configuration

Create the MySQL database:

```sql
CREATE DATABASE finguard;
```

Set these environment variables:

```text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret
```

Run the backend.

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8081
```

---

## Frontend Setup

Open the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Set the frontend API URL:

```text
VITE_API_BASE_URL=http://localhost:8081/api
```

Run the frontend:

```bash
npm run dev
```

---

## Production Deployment

The live application is deployed using:

```text
Cloudflare Pages
        |
        | HTTPS
        v
Oracle Cloud VM
        |
        v
Nginx
        |
        v
Spring Boot
        |
        v
MySQL
```

The Spring Boot backend runs as a `systemd` service so it starts automatically after a server reboot.

Nginx acts as the reverse proxy, and HTTPS is provided using Let's Encrypt certificates managed by Certbot.

---

## Project Structure

```text
bank-of-trust/
│
├── src/
│   ├── main/
│   │   ├── java/com/TrustLedger/
│   │   │   ├── Config/
│   │   │   ├── Controller/
│   │   │   ├── DTOs/
│   │   │   ├── Exception/
│   │   │   ├── Model/
│   │   │   ├── Repository/
│   │   │   ├── Security/
│   │   │   └── Service/
│   │   └── resources/
│   └── test/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── pom.xml
└── README.md
```

---

## Main Backend Concepts Demonstrated

- REST API design
- Layered architecture
- Dependency injection
- DTOs
- Entity relationships
- Spring Data JPA
- MySQL persistence
- Exception handling
- Request validation
- Database transactions
- JWT authentication
- Role-based authorization
- Spring Security filter chain
- CORS configuration
- Unit testing with JUnit and Mockito
- Linux deployment
- Reverse proxy configuration
- HTTPS configuration

---

## Repository

**GitHub:**  
https://github.com/Shivasathvik1/bank-of-trust

---

## Disclaimer

Bank of Trust is a simulated banking application created for learning and portfolio demonstration purposes.

No real financial institution, real banking network, or real-money payment provider is connected to this application.
