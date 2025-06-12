const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set static HTML (optional, if you want to serve your form)
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MySQL

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Render home page
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle user creation
// app.post('/create', async (req, res) => {
//   const { username, email, password, age } = req.body;

//   try {
//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert into MySQL
//     const sql = 'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)';
//     db.query(sql, [username, email, hashedPassword, age], (err, result) => {
//       if (err) {
//         console.error('Error inserting user:', err);
//         return res.status(500).send('Error saving user');
//       }

//       // Create JWT token
//       const token = jwt.sign({ email }, "shhhhh");

//       // Set cookie
//       res.cookie("token", token);

//       // Render success page
//       res.render('create'); // Make sure this exists in views folder
//     });

//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).send('Something went wrong');
//   }
// });


// Route to handle user creation
app.post('/create', async (req, res) => {
  const { username, email, password, age } = req.body;

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into MySQL
    const sql = 'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, email, hashedPassword, age], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send('Error saving user');
      }

      // Redirect to login page after successful registration
      res.redirect('/login');
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Something went wrong');
  }
});





// Logout route
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Login form route
app.get("/login", (req, res) => {
  res.render("login"); // Make sure login.ejs exists
});

// Login handling route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Login DB error:", err);
      return res.status(500).send("Something went wrong");
    }

    if (results.length === 0) {
      return res.send("User not found");
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Incorrect password");

    // Generate JWT
const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.cookie("token", token);
    //   res.send("Login successful");
      res.render("create");
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
