const mysql = require("mysql2");

// Create MySQL Connection
const db = mysql.createConnection({
    host: "localhost",      // Change if necessary
    user: "root",           // Your MySQL username
    password: "Abanikadimashi132",           // Your MySQL password
    database: "LibraryManagementSystem" // Your database name
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL Database!");
    }
});

module.exports = db;
