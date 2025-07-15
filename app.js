

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
app.use(express.urlencoded({ extended: true }));

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
app.get('/swap', (req, res) => {
  res.render('swap');
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

// // Donation handling
// app.post('/donate', upload.single('image'), (req, res) => {
//   const { category, description, selectedNgo } = req.body;
//   const imagePath = req.file ? req.file.filename : null;

//   if (!category || !description || !imagePath || !selectedNgo) {
//     return res.status(400).send('All fields are required.');
//   }

//   const sql = 'INSERT INTO donations (category, description, image_path, selected_ngo) VALUES (?, ?, ?, ?)';
//   db.query(sql, [category, description, imagePath, selectedNgo], (err) => {
//     if (err) return res.status(500).send('Database error.');
//     res.render('donation-success');
//   });
// });

app.post('/donate', upload.single('image'), (req, res) => {
  const { category, description, selectedNgo, userloc } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  if (!category || !description || !imagePath || !selectedNgo || !userloc) {
    return res.status(400).send('All fields including location are required.');
  }

  const sql = 'INSERT INTO donations (category, description, image_path, selected_ngo, userloc) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [category, description, imagePath, selectedNgo, userloc], (err) => {
    if (err) return res.status(500).send('Database error.');
    // res.render('donation-success');
     res.json({ message: '🎉 Donation submitted successfully!' });
    
   
  });
});

app.get('/donation-success', (req, res) => {
  res.render('donation-success');
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
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Analysis Result</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        background: url('https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1470&q=80') no-repeat center center fixed;
        background-size: cover;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .result-container {
        background-color: rgba(255, 255, 255, 0.95);
        padding: 40px;
        border-radius: 16px;
        max-width: 600px;
        width: 90%;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        text-align: center;
      }

      .result-container h2 {
        font-size: 2rem;
        margin-bottom: 20px;
        color: #2e7d32;
      }

      .result-container p {
        font-size: 1.1rem;
        margin: 10px 0;
      }

      .btn {
        display: inline-block;
        margin: 10px 8px;
        background-color: #4CAF50;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        transition: background-color 0.3s ease;
      }

      .btn:hover {
        background-color: #388e3c;
      }
    </style>
  </head>
  <body>
    <div class="result-container">
      <h2>♻️ AI Analysis Result</h2>
      <p><strong>Detected Item:</strong> ${label}</p>
      <p><strong>Item Age:</strong> ${age} months</p>
      <p><strong>Suggestion:</strong> ${suggestion}</p>

      <a href="/recycle" class="btn">🔁 Analyze Another</a>
      <a href="/create" class="btn">🏠 Back to Dashboard</a>
      <a href="/chat" class="btn">💡 Get Detailed Tips</a>
    </div>
  </body>
  </html>
`);

  } catch (err) {
    console.error('Hugging Face API Error:', err.response?.data || err.message);
    res.status(500).send('Error analyzing the image');
  }
});





// Route to display more tips page
app.get('/chat', (req, res) => {
  res.render('chat', {
    title: 'Your Page Title',
    messages: [] // or some default message data
  });
});



// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Hello there",
//     config: {
//       systemInstruction: "You are a doctor.you will only reply to the problem related to medical human body issues,you have to solve query of user in simplest way.if user asked any question not related to medical reply them i am here only to help you as a mini doctor friend please asked relevant key",
//     },
//   });
//   console.log(response.text);
// }

// await main();








app.use(express.static('public')); // Serve HTML from public folder



app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userMessage,
      config: {
        systemInstruction:
          "you are a eco buddy suggest some ideas related to recycle the products ,sustainable environment .only reply to those question which covers these",
      },
    });

    res.json({ reply: response.text });
  } catch (err) {
    res.status(500).json({ error: 'AI request failed' });
  }
});



// Multer setup for file upload
const s= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const u= multer({ storage: s });

// Route: form page
app.get('/swap', (req, res) => {
  res.render('swap');
});

// Route: form submission
app.post('/swap', u.single('itemImage'), (req, res) => {
  const { itemName, description } = req.body;
  const imagePath = `/uploads/${req.file.filename}`;

  const sql = "INSERT INTO items (name, description, image_path) VALUES (?, ?, ?)";
  db.query(sql, [itemName, description, imagePath], (err, result) => {
    if (err) throw err;
    res.send('Item uploaded successfully!');
  });
});





// Route to receive location and insert into DB

// Route to display all swap items
app.get('/items', (req, res) => {
  const sql = "SELECT * FROM items ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('items', { items: results });
  });
});
// Route to show notifications (example data or from DB)
app.get('/notifications', (req, res) => {
  const sql = "SELECT * FROM notifications ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('notifications', { notifications: results });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

