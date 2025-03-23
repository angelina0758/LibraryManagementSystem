const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Show Login Page
router.get("/", (req, res) => {
    res.render("login", { error: "" }); 
});

// Handle Login Request
router.post("/", (req, res) => {
    const { gmail_id, password } = req.body;

    // Query to check if user exists in authentication table
    const sql = "SELECT * FROM authentication WHERE gmail_id = ? AND password = ?";
    
    db.query(sql, [gmail_id, password], (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.render("error"); // Show error page if query fails
        } else {
            if (results.length > 0) {
                // res.render("homeAdmin"); // If user exists, render home page
                res.redirect('/');
            } else {
                res.render("login", { error: "Invalid Gmail or Password. Try again!" });
                
            }
        }
    });
});

module.exports = router;
