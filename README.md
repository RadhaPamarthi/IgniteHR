# IgniteHR

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" height="60" alt="Go" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="60" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="60" alt="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="60" alt="MongoDB" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" height="60" alt="Docker" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" height="60" alt="Kubernetes" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" height="60" alt="Tailwind CSS" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="60" alt="CSS3" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="60" alt="HTML5" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="60" alt="Git" />
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Go Version](https://img.shields.io/badge/Go-1.19-blue.svg)](https://golang.org/doc/go1.19) [![Testify](https://img.shields.io/badge/Testify-Unit%20Testing-blue.svg)](https://github.com/stretchr/testify) [![React Version](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/) [![Gin Framework](https://img.shields.io/badge/Gin-1.7.7-red.svg)](https://gin-gonic.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-4.4.x-green.svg)](https://www.mongodb.com/) [![GORM](https://img.shields.io/badge/GORM-1.22-blue.svg)](https://gorm.io/) [![SMTP](https://img.shields.io/badge/SMTP-Email%20Service-blue.svg)](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) [![bcrypt](https://img.shields.io/badge/bcrypt-Password%20Hashing-orange.svg)](https://github.com/golang/crypto/blob/master/bcrypt/bcrypt.go) [![Unit Testing](https://img.shields.io/badge/Unit%20Testing-Passed-brightgreen.svg)](https://en.wikipedia.org/wiki/Unit_testing) [![REST API](https://img.shields.io/badge/RESTful-API-lightgrey.svg)](https://en.wikipedia.org/wiki/Representational_state_transfer) [![HTML](https://img.shields.io/badge/HTML5-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.0-blue.svg)](https://tailwindcss.com/) [![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![Swagger](https://img.shields.io/badge/Swagger-API%20Documentation-green.svg)](https://swagger.io/)

## 🚀 Overview

**IgniteHR** is a comprehensive HR dashboard designed to streamline employee management, payroll processing, leave management, and time tracking. Built with a robust backend and an intuitive frontend, IgniteHR provides HR teams with the tools they need to manage operations efficiently.

## 📌 Features

- 🔹 **Employee Management** - Add, update, and remove employees seamlessly.
- 🔹 **Payroll Processing** - Manual salary setting and automated payroll generation every 30 days.
- 🔹 **Leave Management** - Policy-driven leave tracking and approval system.
- 🔹 **Time Tracking** - Monitor working hours and attendance records.
- 🔹 **Email Integration** - Automates leave request handling via emails.
- 🔹 **Secure Authentication** - Role-based access control for HR and employees.
- 🔹 **Admin Dashboard** - Real-time insights into employee data and leave requests.

## 📸 Screenshots

### 🔑 Login Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/1b9955d9-ac2e-495b-8038-da450aa9e85e" />


### 📅 Leave Management
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/1e311a9e-a898-4871-83b5-76e66f549769" />


### ⏳ Time Tracking
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/51ccb2a0-392c-40bd-b8f2-e61a11d9ba09" />


### 👥 Employee Directory
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/960cf864-d262-458e-ba64-de90619c3c0c" />


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

