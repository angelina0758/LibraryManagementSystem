# Library Management System

## Overview
The **Library Management System** is a web-based application built with **Node.js** and **MySQL** to efficiently manage library operations such as book inventory, user records, and borrowing transactions.

## Features
### 🔹 Admin Features
- **Secure Login**: Authentication system for the library administrator.
- **User Management**: Add, view, and manage library members.
- **Book Inventory Management**: Add new books to the library catalog.
- **Issue & Return Books**: Track book lending and manage returns, including overdue fines.
- **User Activity Tracking**: View issued books per user.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Frontend:** EJS, HTML, CSS

## Installation Guide
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Steps to Set Up
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/library-management-system.git
   cd library-management-system
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up the database:**
   - Import the provided SQL schema into MySQL.
   - Configure database credentials in `.env`.
4. **Start the server:**
   ```sh
   npm start
   ```
5. **Access the application:**
   Open `http://localhost:3000` in your browser.

## API Endpoints

| Method | Route | Description |
|--------|-------------------------|----------------------------------|
| **GET** | `/` | Renders the home page for the admin. |
| **GET** | `/add-book` | Displays the "Add Book" page. |
| **GET** | `/add-user` | Displays the "Add User" page. |
| **GET** | `/issue-book` | Displays the "Issue Book" page. |
| **GET** | `/return-book` | Displays the "Return Book" page. |
| **GET** | `/api/return-book?userId=<id>` | Fetches issued book records for a user. |
| **GET** | `/logout` | Logs out the admin. |
| **POST** | `/add-book` | Adds a book to the library database. |
| **POST** | `/add-user` | Adds a new library user. |
| **POST** | `/issue-book` | Issues books to a user. |
| **POST** | `/return-book` | Updates records to mark book return. |
| **GET** | `/login` | Displays the login page. |
| **POST** | `/login` | Authenticates the user. |

## Contribution Guidelines
1. **Fork the repository.**
2. **Create a new branch:**
   ```sh
   git checkout -b feature-branch
   ```
3. **Commit your changes:**
   ```sh
   git commit -m "Add new feature"
   ```
4. **Push to GitHub and create a Pull Request.**

## License
This project is licensed under the **MIT License**.

---

🚀 Happy Coding!
