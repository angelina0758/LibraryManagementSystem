# Library Management System

## Overview
The **Library Management System** is a web-based application built with **Node.js** and an **SQL database** to efficiently manage library operations such as book inventory, user records, and borrowing transactions.

## Features
- **Admin Login**: Secure authentication for the library administrator
- **Creating Library Members**: Admin can add user records to the database
- **Adding New Books**: Admin can add books to the library catalog
- **Issuing Books to Users**: Track book lending with due dates
- **Returning Books**: Manage book returns and overdue fines
- **Display User ID and Issued Books**: View which books are issued to which users

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Frontend :**  EJS 

## Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) or another SQL database

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/library-management-system.git
   cd library-management-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=library_db
     JWT_SECRET=your_secret_key
     ```
4. Set up the database:
   ```sh
   npm run migrate
   npm run seed  # Optional: Populate with sample data
   ```
5. Start the server:
   ```sh
   npm start
   ```
6. Access the application at `http://localhost:3000`

## API Endpoints
| Method | Endpoint            | Description                       |
|--------|--------------------|-----------------------------------|
| POST   | /admin/login       | Admin login                      |
| POST   | /users             | Add a new user record (Admin only) |
| GET    | /users             | Get all user records             |
| POST   | /books             | Add a new book (Admin only)      |
| GET    | /books             | Get all books                    |
| POST   | /issue/:bookId     | Issue a book to a user           |
| POST   | /return/:bookId    | Return a borrowed book           |
| GET    | /issued-books      | Display user ID and issued books |

## Contribution Guidelines
1. Fork the repository
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to GitHub and create a Pull Request

## License
This project is licensed under the MIT License.

---
Feel free to modify based on your project setup! 🚀

