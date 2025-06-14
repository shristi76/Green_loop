// const express = require('express');
// const path = require('path');
// const mysql = require('mysql2');
// const app = express();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// // const fs = require('fs');
// // const fetch = require('node-fetch'); // <-- REQUIRED for Hugging Face API


// require('dotenv').config();


// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());

// // Set static HTML (optional, if you want to serve your form)
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Connect to MySQL

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// db.connect((err) => {
//   if (err) {
//     console.error('MySQL connection error:', err);
//     return;
//   }
//   console.log('Connected to MySQL database!');
// });

// // Render home page
// app.get('/', (req, res) => {
//   res.render('index');
// });

// // Route to handle user creation
// // app.post('/create', async (req, res) => {
// //   const { username, email, password, age } = req.body;

// //   try {
// //     // Hash password
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     // Insert into MySQL
// //     const sql = 'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)';
// //     db.query(sql, [username, email, hashedPassword, age], (err, result) => {
// //       if (err) {
// //         console.error('Error inserting user:', err);
// //         return res.status(500).send('Error saving user');
// //       }

// //       // Create JWT token
// //       const token = jwt.sign({ email }, "shhhhh");

// //       // Set cookie
// //       res.cookie("token", token);

// //       // Render success page
// //       res.render('create'); // Make sure this exists in views folder
// //     });

// //   } catch (error) {
// //     console.error('Unexpected error:', error);
// //     res.status(500).send('Something went wrong');
// //   }
// // });


// // Route to handle user creation
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

//       // Redirect to login page after successful registration
//       res.redirect('/login');
//     });

//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).send('Something went wrong');
//   }
// });


// //recycle routes
// // app.get('/recycle', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'public', 'recycle.html'));
// // });


// //ejs mai
// app.get('/donate', (req, res) => {
//   res.render('donate');
// });
// //donate routes  for html file
// // app.get('/donate', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'public', 'donate.html'));
// // });

// //for ejs
// app.get('/recycle', (req, res) => {
//   res.render('recycle');
// });



// // Logout route
// app.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.redirect("/");
// });

// //muttler for image uploads in donation section
// app.use(express.static('uploads'));
// const multer = require('multer');


// //set up multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Folder must exist
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });
// const upload = multer({ storage });



//     app.post('/donate', upload.single('image'), (req, res) => {
//   const { category, description, selectedNgo } = req.body;
//   const imagePath = req.file ? req.file.filename : null;

//   if (!category || !description || !imagePath || !selectedNgo) {
//     return res.status(400).send('All fields are required.');
//   }

//   const sql = 'INSERT INTO donations (category, description, image_path, selected_ngo) VALUES (?, ?, ?, ?)';
//   db.query(sql, [category, description, imagePath, selectedNgo], (err, result) => {
//     if (err) {
//       console.error('Error inserting donation:', err);
//       return res.status(500).send('Database error.');
//     }

// const { category, description, selectedNgo } = req.body;

//     // res.send('🎉 Donation submitted successfully!');
//       res.render('donation-success');
//   });
  
//     });



// app.get('/create', (req, res) => {
//   res.render('create'); // Ensure 'create.ejs' exists in the views folder
// });



// //data for donation item


// // Login form route
// app.get("/login", (req, res) => {
//   res.render("login"); // Make sure login.ejs exists
// });

// // Login handling route
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const sql = 'SELECT * FROM users WHERE email = ?';
//   db.query(sql, [email], async (err, results) => {
//     if (err) {
//       console.error("Login DB error:", err);
//       return res.status(500).send("Something went wrong");
//     }

//     if (results.length === 0) {
//       return res.send("User not found");
//     }

//     const user = results[0];

//     // Compare password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.send("Incorrect password");

//     // Generate JWT
// const token = jwt.sign({ email }, process.env.JWT_SECRET);
//     res.cookie("token", token);
//     //   res.send("Login successful");
//       res.render("create");
//   });
// });
// //ai api of recycle page
// const fs = require('fs');
// const axios = require('axios');
// require('dotenv').config();


// app.set('view engine', 'ejs');



// app.post('/recycle', upload.single('image'), async (req, res) => {
//   const age = parseInt(req.body.age);
//   const imagePath = req.file.path;

//   // Read the uploaded image as binary
//   const image = fs.readFileSync(imagePath);
 


//   try {
//     const response = await axios.post(
//       'https://api-inference.huggingface.co/models/microsoft/resnet-50',
//       image,
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
//           'Content-Type': 'application/octet-stream',
//         },
//       }
//     );

//     const label = response.data[0]?.label || 'Unknown';

//     // Simple suggestion logic
//    // Define advanced suggestions based on item labels
// let suggestion = 'Recycle';

// const labelLower = label.toLowerCase();

// if (labelLower.includes('clothing') || labelLower.includes('shirt') || labelLower.includes('jeans') || labelLower.includes('shoe')) {
//   if (age < 12) {
//     suggestion = 'Donate to a local shelter or charity. Many NGOs accept gently used clothing.';
//   } else {
//     suggestion = 'Cut it into cleaning rags or use the fabric for DIY projects like tote bags or pillow covers.';
//   }
// } else if (labelLower.includes('plastic') || labelLower.includes('bottle')) {
//   suggestion = `Clean the plastic item and place it in your local recycling bin.
//     Alternatively, reuse plastic bottles as plant holders or storage containers.`;
// } else if (labelLower.includes('glass')) {
//   suggestion = `Glass items should be rinsed and placed in a glass-only recycling bin.
//     You can also upcycle them into decorative jars, vases, or candle holders.`;
// } else if (labelLower.includes('paper') || labelLower.includes('cardboard')) {
//   suggestion = `Flatten cardboard boxes before recycling. Shred paper and compost it, or use it for crafts.`;
// } else if (labelLower.includes('can') || labelLower.includes('metal')) {
//   suggestion = `Rinse metal cans and remove labels. Recycle them or repurpose as pencil holders or mini planters.`;
// } else if (labelLower.includes('electronic') || labelLower.includes('cell phone') || labelLower.includes('laptop')) {
//   suggestion = `Take the electronic item to an e-waste recycling center.
//     Many retailers like Best Buy or local municipal offices have drop-off programs.`;
// } else {
//   suggestion = 'Recycle appropriately if possible. Try to reuse or repurpose the item before disposing of it.';
// }


//     // Delete the temp image file
//     fs.unlinkSync(imagePath);

//     res.send(`
//       <div style="text-align:center; padding:40px; background-color:yellow;">
//         <h2>♻️ AI Analysis Result</h2>
//         <p><strong>Detected Item:</strong> ${label}</p>
//         <p><strong>Item Age:</strong> ${age} months</p>
//         <p><strong>Suggestion:</strong> ${suggestion}</p>
//         <a href="/recycle" style="display:inline-block; margin-top:20px; background:#4CAF50; color:white; padding:10px 20px; border-radius:5px;">Analyze Another</a>
//         <a href="/create" style="display:inline-block; margin-top:20px; background:#4CAF50; color:white; padding:10px 20px; border-radius:5px;">back to dashboard</a>
//          <a href="/more" style="display:inline-block; margin-top:20px; background:#4CAF50; color:white; padding:10px 20px; border-radius:5px;">get detail tips</a>
//       </div>
//     `);
//   }
//  catch (err) {
//   console.error('Hugging Face API Error:', err.response?.data || err.message);
//   res.status(500).send('Error analyzing the image');
// }

// });


// //here
// require('dotenv').config();
// const cors = require('cors');
// const { GoogleGenAI } = require('@google/genai');



// const PORT = process.env.PORT || 3000;

//   // Gemini-based medical chat endpoint
//   app.post('/ask', async (req, res) => {
//     const userMessage = req.body.message;

//     try {
//       const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

//       const result = await model.generateContent({
//         contents: [{ role: 'user', parts: [{ text: userMessage }] }],
//         generationConfig: {
//           temperature: 0.7,
//         },
//         systemInstruction: {
//           role: 'system',
//           parts: [{
//             text: 'You are a doctor. You will only reply to problems related to medical human body issues. If a user asks something unrelated, reply: "I am here only to help with medical problems, please ask something relevant."'
//           }],
//         }
//       });

//       const responseText = result.response.text();
//       res.json({ reply: responseText });

//     } catch (err) {
//       console.error('Gemini API Error:', err.message || err);
//       res.status(500).json({ error: 'AI request failed' });
//     }
//   });


//   // Start server
//   app.listen(3000, () => {
//     console.log('Server running at http://localhost:3000');
//   });

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Required modules

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const axios = require('axios');
const multer = require('multer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// JWT verification middleware
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

// MySQL connection
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

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/create', verifyToken, (req, res) => {
  res.render('create');
});

app.get('/donate', (req, res) => {
  res.render('donate');
});

app.get('/recycle', (req, res) => {
  res.render('recycle');
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Multer setup for uploads
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG and PNG images are allowed'), false);
    }
    cb(null, true);
  }
});

// User creation route
app.post('/create', async (req, res) => {
  const { username, email, password, age } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = 'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, email, hashedPassword, age], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send('Error saving user');
      }
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Something went wrong');
  }
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send('Something went wrong');
    if (results.length === 0) return res.send('User not found');

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Incorrect password');

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.cookie('token', token);
    res.redirect('/create');
  });
});

// Donation handling
app.post('/donate', upload.single('image'), (req, res) => {
  const { category, description, selectedNgo } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!category || !description || !imagePath || !selectedNgo) {
    return res.status(400).send('All fields are required.');
  }

  const sql = 'INSERT INTO donations (category, description, image_path, selected_ngo) VALUES (?, ?, ?, ?)';
  db.query(sql, [category, description, imagePath, selectedNgo], (err) => {
    if (err) return res.status(500).send('Database error.');
    res.render('donation-success');
  });
});

// Recycle AI image analysis
app.post('/recycle', upload.single('image'), async (req, res) => {
  const age = parseInt(req.body.age);
  const imagePath = req.file.path;
  const image = fs.readFileSync(imagePath);

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/resnet-50',
      image,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    const label = response.data[0]?.label || 'Unknown';
    let suggestion = 'Recycle';
    const labelLower = label.toLowerCase();

    if (labelLower.includes('clothing') || labelLower.includes('shirt') || labelLower.includes('jeans') || labelLower.includes('shoe')) {
      suggestion = age < 12 ? 'Donate to a local shelter or charity. Many NGOs accept gently used clothing.' : 'Cut it into cleaning rags or use the fabric for DIY projects like tote bags or pillow covers.';
    } else if (labelLower.includes('plastic') || labelLower.includes('bottle')) {
      suggestion = 'Clean the plastic item and place it in your local recycling bin. Alternatively, reuse plastic bottles as plant holders or storage containers.';
    } else if (labelLower.includes('glass')) {
      suggestion = 'Glass items should be rinsed and placed in a glass-only recycling bin. You can also upcycle them into decorative jars, vases, or candle holders.';
    } else if (labelLower.includes('paper') || labelLower.includes('cardboard')) {
      suggestion = 'Flatten cardboard boxes before recycling. Shred paper and compost it, or use it for crafts.';
    } else if (labelLower.includes('can') || labelLower.includes('metal')) {
      suggestion = 'Rinse metal cans and remove labels. Recycle them or repurpose as pencil holders or mini planters.';
    } else if (labelLower.includes('electronic') || labelLower.includes('cell phone') || labelLower.includes('laptop')) {
      suggestion = 'Take the electronic item to an e-waste recycling center. Many retailers like Best Buy or local municipal offices have drop-off programs.';
    } else {
      suggestion = 'Recycle appropriately if possible. Try to reuse or repurpose the item before disposing of it.';
    }

    fs.unlinkSync(imagePath);

    res.send(`
      <div style="text-align:center; padding:40px; background-color:yellow;">
        <h2>♻️ AI Analysis Result</h2>
        <p><strong>Detected Item:</strong> ${label}</p>
        <p><strong>Item Age:</strong> ${age} months</p>
        <p><strong>Suggestion:</strong> ${suggestion}</p>
        <a href="/recycle" style="display:inline-block; margin-top:20px; background:#4CAF50; color:white; padding:10px 20px; border-radius:5px;">Analyze Another</a>
        <a href="/create" style="display:inline-block; margin-top:20px; background:#4CAF50; color:white; padding:10px 20px; border-radius:5px;">Back to Dashboard</a>
        <a href="/more" style="display:inline-block; margin-top:20px; background:#4CAF50; color:white; padding:10px 20px; border-radius:5px;">Get Detailed Tips</a>
      </div>
    `);
  } catch (err) {
    console.error('Hugging Face API Error:', err.response?.data || err.message);
    res.status(500).send('Error analyzing the image');
  }
});
// Route to display more tips page
app.get('/more', (req, res) => {
  res.render('more', {
    title: 'Your Page Title',
    messages: [] // or some default message data
  });
});



app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const model =  ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: 'you are eco buddy reply only those questions which include environmental issue and sustainable ',
          },
        ],
      },
    });

    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini API Error:', err.message || err);
    res.status(500).json({ error: 'AI request failed' });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
