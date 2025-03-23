const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;

const app = express();
const db = require("./models/db"); // Import database connection
const homeRoutes = require('./routes/homeRoutes');
const loginRoutes = require("./routes/loginRoutes");

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve CSS files
app.set("view engine", "ejs");



// Import Routes

app.use('/', homeRoutes);
app.use("/login", loginRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
