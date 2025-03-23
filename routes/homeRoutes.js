const express = require('express');
const router = express.Router();
const db = require("../models/db");

// Home Admin Page
router.get('/', (req, res) => {
    res.render('homeAdmin'); // Render the homeAdmin.ejs page
});

// Add Book Page
router.get('/add-book', (req, res) => {
    res.render('addBook'); // Render the addBook.ejs page
});

router.get('/add-user', (req, res) => {
    res.render('addUser'); // Render the addBook.ejs page
});


// Issue Book Page
router.get('/issue-book', (req, res) => {
    res.render('issueBook'); // Render the issueBook.ejs page
});

// Return Book Page
router.get('/return-book', (req, res) => {
    res.render('returnBook'); // Render the returnBook.ejs page
});


router.get('/api/return-book', (req, res) => {
    const { userId } = req.query; // Get userId from query parameters (for search)

    // SQL query to fetch records from the Display table
    const query = `
        SELECT *
        FROM Display
        ${userId ? 'WHERE UserId = ?' : ''}
    `;

    // Execute the query
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching records:', err);
            return res.status(500).json({ error: 'Error fetching records' });
        }

        // Send the results as JSON
        res.json(results);
    });
});

// Logout Functionality
router.get('/logout', (req, res) => {
    // Clear session or perform logout logic
    res.redirect('/login'); // Redirect to the home page after logout
});

router.post('/add-book', (req, res) => {
    // Extract data from the form
    const { title, author, genre, isbn, price } = req.body;

    // SQL query to insert data into the Book table
    const query = `
        INSERT INTO Book (Title, Author, Genre, ISBN, Price, AvailabilityStatus)
        VALUES (?, ?, ?, ?, ?, 'Available')
    `;

    // Execute the query
    db.query(query, [title, author, genre, isbn, price], (err, result) => {
        if (err) {
            console.error('Error adding book:', err);
            return res.status(500).send('Error adding book to the database');
        }

        // Redirect to the home page or show a success message
        res.redirect('/');
    });
});

router.post('/add-user', (req, res) => {
    // Extract data from the form
    const { fname, lname, phone, email, addr } = req.body;

    // SQL query to insert data into the User table
    const query = `
        INSERT INTO User (Fname, Lname, PhoneNo, Email, Addr)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Execute the query
    db.query(query, [fname, lname, phone, email, addr], (err, result) => {
        if (err) {
            console.error('Error adding user:', err);
            return res.status(500).send('Error adding user to the database');
        }

        // Redirect to the home page or show a success message
        res.redirect('/');
    });
});

router.post('/issue-book', async (req, res) => {
    const { userId, bookIds, dueDate } = req.body;
    // Step 1: Check if the user exists
    const checkUserQuery = 'SELECT * FROM User WHERE UserId = ?';
    db.query(checkUserQuery, [userId], (err, userResults) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).redirect('/?message=Error checking user&type=error');
        }
        if (userResults.length === 0) {
            return res.redirect('/?message=User does not exist&type=error');
        }
        // Step 2: Split the bookIds into an array
        const bookIdArray = bookIds.split(/[ ,]+/)
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id)); // Remove NaN values
        if (bookIdArray.length === 0) {
            return res.redirect('/?message=No valid Book IDs provided&type=error');
        }
        // Step 3: Process each book
        let successCount = 0;
        let errorMessages = [];
        // Use Promise.all to handle asynchronous operations
        Promise.all(bookIdArray.map(async (bookId) => {
            try {
                // Step 3.1: Check if the book exists and is available
                const checkBookQuery = 'SELECT * FROM Book WHERE BookId = ? AND AvailabilityStatus = "Available"';
                const [bookResults] = await db.promise().query(checkBookQuery, [bookId]);
                if (bookResults.length === 0) {
                    errorMessages.push(`Book with ID ${bookId} is not available or does not exist`);
                    return;
                }
                
                // Get the correct book name field - it might be Title or BookName depending on your Book table schema
                const bookName = bookResults[0].Title || bookResults[0].BookName;
                
                // Step 3.2: Insert into the Report table
                const insertReportQuery = `
                    INSERT INTO Report (BookId, UserId, IssueDate, DueDate)
                    VALUES (?, ?, CURDATE(), ?)
                `;
                await db.promise().query(insertReportQuery, [bookId, userId, dueDate]);
                
                // Step 3.3: Update the Book table to set AvailabilityStatus to 'Issued'
                const updateBookQuery = `
                    UPDATE Book
                    SET AvailabilityStatus = 'Issued'
                    WHERE BookId = ?
                `;
                await db.promise().query(updateBookQuery, [bookId]);
                
                // Step 3.4: Insert into the Display table - FIXED to match your schema
                const insertDisplayQuery = `
                    INSERT INTO Display (UserId, BookId, BookName, DueDate)
                    VALUES (?, ?, ?, ?)
                `;
                await db.promise().query(insertDisplayQuery, [userId, bookId, bookName, dueDate]);
                
                successCount++; // Increment success count
            } catch (err) {
                console.error('Error processing book:', err);
                console.error('Error details:', err.message, err.sql); // Log more details including SQL
                errorMessages.push(`Error processing book with ID ${bookId}: ${err.message}`);
            }
        })).then(() => {
            // Step 4: Send response after processing all books
            if (errorMessages.length > 0) {
                const message = `Some books could not be issued. Successfully issued: ${successCount}. Errors: ${errorMessages.join(', ')}`;
                return res.redirect(`/?message=${encodeURIComponent(message)}&type=error`);
            } else {
                const message = `All books issued successfully. Total issued: ${successCount}`;
                return res.redirect(`/?message=${encodeURIComponent(message)}&type=success`);
            }
        }).catch(err => {
            console.error('Error in Promise.all:', err);
            return res.status(500).redirect('/?message=Server error processing request&type=error');
        });
    });
});

router.post('/return-book', (req, res) => {
    const { bookId, userId } = req.body;

    console.log(`Attempting to return book: BookId=${bookId}, UserId=${userId}`);

    // Step 1: Update the Report table to set ReturnDate
    const updateReportQuery = `
        UPDATE Report
        SET ReturnDate = CURDATE()
        WHERE BookId = ? AND UserId = ?
    `;
    db.query(updateReportQuery, [bookId, userId], (err, updateReportResult) => {
        if (err) {
            console.error('Error updating Report table:', err);
            return res.status(500).send('Error updating Report table');
        }

        console.log(`Updated ${updateReportResult.affectedRows} record(s) in Report table`);

        // Step 2: Delete the record from the Display table
        const deleteDisplayQuery = 'DELETE FROM Display WHERE BookId = ? AND UserId = ?';
        db.query(deleteDisplayQuery, [bookId, userId], (err, deleteDisplayResult) => {
            if (err) {
                console.error('Error deleting record from Display table:', err);
                return res.status(500).send('Error deleting record from Display table');
            }

            console.log(`Deleted ${deleteDisplayResult.affectedRows} record(s) from Display table`);

            // Step 3: Update the Book table to set AvailabilityStatus to 'Available'
            const updateBookQuery = `
                UPDATE Book
                SET AvailabilityStatus = 'Available'
                WHERE BookId = ?
            `;
            db.query(updateBookQuery, [bookId], (err, updateBookResult) => {
                if (err) {
                    console.error('Error updating book status:', err);
                    return res.status(500).send('Error updating book status');
                }

                console.log(`Updated ${updateBookResult.affectedRows} record(s) in Book table`);

                // Send a success response
                res.sendStatus(200);
            });
        });
    });
});
module.exports = router;