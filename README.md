# IgniteHR

## 🚀 Overview

**IgniteHR** is a comprehensive HR dashboard designed to streamline employee management, payroll processing, leave management, and more. Built with a robust backend and an intuitive frontend, IgniteHR provides HR teams with the tools they need to manage operations efficiently.

## 📌 Features

- 🔹 **Employee Management** - Add, update, and remove employees seamlessly.
- 🔹 **Payroll Processing** - Manual salary setting and automated payroll generation every 30 days.
- 🔹 **Leave Management** - Policy-driven leave tracking and approval system.
- 🔹 **Email Integration** - Automates leave request handling via emails.
- 🔹 **Secure Authentication** - Role-based access control for HR and employees.
- 🔹 **Admin Dashboard** - Real-time insights into employee data and leave requests.

## 🛠️ Tech Stack

### Backend

- **Golang** - Core backend logic.
- **MongoDB** - NoSQL database for efficient data storage.
- **Gin Framework** - Fast HTTP router for API development.
- **Docker & Kubernetes** - Containerized deployment.
- **Redis** - Caching for improved performance.

### Frontend

- **React.js** - Dynamic UI development.
- **Tailwind CSS** - Modern styling for responsive design.
- **Redux** - State management for scalable applications.

### Other Tools

- **Swagger** - API documentation.
- **GCP/AWS** - Cloud-based hosting.
- **GitHub Actions** - CI/CD pipeline for automated deployments.

## 🏗️ Installation

### Prerequisites

Ensure you have the following installed:

- Go v1.18+
- Node.js v16+
- MongoDB
- Docker (optional for containerization)

### Backend Setup

```sh
# Clone the repository
git clone https://github.com/yourusername/ignitehr.git
cd ignitehr/backend

# Install dependencies
go mod tidy

# Run the backend
go run main.go
```

### Frontend Setup

```sh
cd ignitehr/frontend

# Install dependencies
yarn install

# Start the frontend
yarn start
```

## 📜 API Documentation

The API is documented using **Swagger**. After running the backend, access it at:

```
http://localhost:8080/swagger/index.html
```

## 🚀 Deployment

For deploying on **Docker**:

```sh
docker-compose up --build
```

For **Kubernetes**:

```sh
kubectl apply -f k8s/
```
