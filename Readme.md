# School Payment & Dashboard Project

A full-stack **School Payment and Dashboard** application with a secure backend microservice and a responsive frontend. It enables transaction management, reporting, and visual dashboards for schools, trustees, and administrators.

---

## Table of Contents
1. [Backend Overview](#backend-overview)  
2. [Frontend Overview](#frontend-overview)  
3. [Setup & Installation](#setup--installation)  
4. [API Endpoints](#api-endpoints-backend)  
5. [Environment Variables](#environment-variables)  
6. [API Usage Example](#api-usage-example)  
7. [Testing](#testing)  
8. [Scalability & Security](#scalability--security)  
9. [Frontend Features](#frontend-features)  
10. [Submission Guidelines](#submission-guidelines)  
11. [Reference & Resources](#reference--resources)  
12. [License](#license)  

---

## Backend Overview
**Tech Stack:** Node.js, NestJS/Express/Fastify, MongoDB Atlas  

**Schemas:**  
- Orders  
- Order Status  
- Webhook Logs  
- Users (JWT Authentication)  

**Key Features:**  
- REST API for managing transactions and payments  
- Payment gateway integration  
- JWT-secured endpoints  
- Webhook logging and update routes  
- Aggregated endpoints for dashboard reporting  
- Pagination, sorting, filtering (by school ID, status, date)  
- Full error handling and data validation  

---

## Frontend Overview
**Tech Stack:** React.js (Vite or CRA), Tailwind CSS / Shadcn UI, Axios, React Router

**Dashboard Pages:**  
- Transactions Overview (paginated, searchable, filterable table)  
- Transaction Status Check (query by customOrderId)  


---

## Setup & Installation

### Backend
```bash
git clone https://github.com/sohit-mishra/edviron.git
cd edviron
npm install
```

## **Installation & Setup**

### **Backend**

1. Navigate to the Backend folder:

```bash
cd Backend
```

2. Install dependencies:

```
npm install
```

3. Create a .env file:

```
# JWT
JWT_ACCESS_SECRET=12563
JWT_REFRESH_SECRET=98765

# App frontend
FRONTEND_URL=http://localhost:5173

# Mail service
EMAIL_SERVICE=
EMAIL_USER=
EMAIL_PASS=

# Database
MONGODB_URI=mongodb://localhost:27017/edviron
PORT=4000

CF_APP_ID=
CF_SECRET=
CF_STAGE=
```

4. Start the server:

```
npm run start
```

## Frontend

1. Navigate to the Frontend folder:

```
cd Frontend

```

2. Install dependencies:

```
npm install
```

3. Create a .env file:

```
VITE_BACKEND_URL=http://localhost:4000
```

4. Start the development web:

```
npm run dev
```

Open your browser at http://localhost:3000