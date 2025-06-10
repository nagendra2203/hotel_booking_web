



/// Initializing ///
const express = require("express");
const app = express();
const port = 8001;
var mysql = require("mysql2");
var multer = require('multer');
var cors = require('cors')
var bodyParser = require('body-parser');
//var moment = require('moment');
const XLSX = require('xlsx');
const moment = require('moment-timezone');

const axios = require("axios");
let is_test = true
const outputDirectory = '/var/www/html/POS/FOM';
const outputDirectoryPOS = '/var/www/html/POS/Ebill';
// const pdf = require('html-pdf');
var path = require('path');
const qs = require('qs');
const https = require('https')
var fs = require('fs');
const ExcelJS = require('exceljs');
var request = require('request');
const { create } = require('xmlbuilder2');
const { parseString } = require('xml2js');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
// const niceInvoice = require("nice-invoice");
const PDFDocument = require("pdfkit");
const PMSInvoiceDir = 'http://122.166.2.21/PMS_Invoice'
const FormData = require('form-data');
const session = require('express-session');
const { Readable } = require('stream');
const util = require('util');
const pipeline = util.promisify(require('stream').pipeline);
const cron = require('node-cron');
const datex = require('date-and-time')
require("dotenv").config();
const mysqlStore = require('express-mysql-session')(session);
const IN_PROD = process.env.NODE_ENV === 'production'
let isThirdParty = false;
const TWO_HOURS = 1000 * 60 * 60 * 24
//Logger
const { createLogger, format, transports } = require('winston');




const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

//const app = express();
app.use(express.json());

//const logger = require('./logger'); // Import your custom logger

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });  // Make sure this port matches the one used in the frontend

wss.on('connection', (ws) => {
  console.log('A new WebSocket connection established!');
  
  ws.on('message', (message) => {
    console.log('Received message: ', message);
  });

  ws.on('close', () => {
    console.log('A client disconnected!');
  });
});

console.log('WebSocket server is running on ws://localhost:4000');
// // Start HTTP & WebSocket server
// server.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const options = {
  connectionLimit: 300,
  host: "localhost",
  user: "root",
  password: "",
  //database: "oct_1_live",
  database: "testhotel_db",
  
  // host: "172.105.47.108", 
  // user: "mstuser1",
  // password: "!@#$Mst@1234",
  // database: "pms9_Feb25",


  
  createDatabaseTable: true

}






const xlsx = require('xlsx');


// CORS middleware configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Block the request
    }
  }
};

//app.use(cors(corsOptions));

app.use(cors());

const pool = mysql.createPool(options);
const sessionStore = new mysqlStore(options);

sessionStore.onReady().then(() => {
  // MySQL session store ready for use.
  console.log('MySQLStore ready to use');
}).catch(error => {
  // Something went wrong.
  console.error(error);
});


app.use(session({
  name: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  secret: "Hellomst",
  cookie: {
    name: 'newrandomness',
    maxAge: TWO_HOURS,
    sameSite: 'none',
    secure: false,
  }
}))




app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '5mb' })); // support json encoded bodies

// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//   }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  // console.log(req)
  if (!req.session.myVar) {
    // req.session.hotelid = 11;
    // req.session.hotelid = 10;
    req.session.hotelid = 10;
    // req.session.userid = 182;
    req.session.userid = 1;
    // req.session.userid = 196;   // for hotel2_config database
    // req.session.userid = 3;
    req.session.storeId = 1;

  }
  next();

});

/// Connecting to mysql ///
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  //database: "oct_1_live",
  database: "hotel_website",
 
  port:"3306",
  timezone: 'Z', // This sets the timezone to UTC for connection-level date strings
  dateStrings: true, // Treat dates as strings to avoid automatic Date object conversion
  decimalNumbers: true, 
  connectionLimit: 1000

 
   //timezone:'+05:30'
});






//const upload = multer();
const storage = multer.memoryStorage();

const uploadXLSX = multer({ storage: storage });

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const extname = path.extname(file.originalname).toLowerCase();
      if (extname === '.csv') {
        return cb(null, true);
      }
      else{
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and PDF files are allowed.'));
      }
      
      
    }
  },
});


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-related error
    return res.status(400).json({ error: 'File upload error. Please try again.' });
  } else if (err) {
    // Other errors, including fileFilter error
    return res.status(400).json({ error: err.message });
  }
  next();
});




/// Listening to port ///
app.listen(port, () => {
  //console.log(`Example app listening on port ${port}`);
});




app.set('trust proxy', 1); // Trust the first proxy







app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        name:'newrandomness',
        maxAge: TWO_HOURS,
        sameSite: 'none',
        secure: IN_PROD,
        domain:'testhotel2.prysmcable.com'
    }
}))





/////////////////////



const JWT_SECRET = process.env.JWT_SECRET || 'your_secure_secret';
const TOKEN_REFRESH_WINDOW = 30; // Minutes before expiry to refresh

// Middleware to check token with grace period
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    // Allow expired tokens within refresh window
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    
    const [user] = await connection.query(
      `SELECT id, email FROM web_users 
       WHERE user_token = ? 
       AND token_expiration > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
      [token, TOKEN_REFRESH_WINDOW]
    );

    if (!user.length) throw new Error("Invalid/expired token");

    req.user = user[0];
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Register
app.post('/register', async (req, res) => { 
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        status: "failure",
        statusCode: 400,
        message: "Email and password are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send({
        status: "failure",
        statusCode: 400,
        message: "Invalid email format",
      });
    }

    if (password.length < 8) {
      return res.status(400).send({
        status: "failure",
        statusCode: 400,
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user exists
    const [existing] = await connection.promise().query(
      'SELECT id FROM web_users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).send({
        status: "failed",
        statusCode: 403,
        message: "User already exists",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.promise().query(
      'INSERT INTO web_users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "User registered successfully",
      data: {
        userId: result.insertId
      }
    });

  } catch (error) {
    console.error(error);
    res.status(403).send({
      status: "failure",
      statusCode: 403,
      message: "Failed to register user",
    });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: "failure",
        statusCode: 400,
        message: "Email and password are required",
      });
    }

    const [users] = await connection.promise().query(
      'SELECT * FROM web_users WHERE email = ?',
      [email]
    );

    if (!users.length) {
      return res.status(401).send({
        status: "failure",
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({
        status: "failure",
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const expiration = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    await connection.promise().query(
      'UPDATE web_users SET user_token = ?, token_expiration = ?, logged_in = 1 WHERE id = ?',
      [token, expiration, user.id]
    );

    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Login successful",
      data: {
        token,
        expiresIn: 3600
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "failure",
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

// Refresh Token
app.post('/refresh-token', async (req, res) => {
  try {
    const oldToken = req.headers.authorization?.split(' ')[1];
    
    if (!oldToken) {
      return res.status(401).send({
        status: "failure",
        statusCode: 401,
        message: "Authorization token required",
      });
    }

    const decoded = jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true });
    
    const [users] = await connection.promise().query(
      'SELECT id FROM web_users WHERE user_token = ? AND token_expiration > DATE_SUB(NOW(), INTERVAL 30 MINUTE)',
      [oldToken]
    );

    if (!users.length) {
      return res.status(401).send({
        status: "failure",
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    const newToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
    const newExpiration = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    await connection.promise().query(
      'UPDATE web_users SET user_token = ?, token_expiration = ? WHERE id = ?',
      [newToken, newExpiration, decoded.id]
    );

    // Revoke old token
    await connection.promise().query(
      'INSERT INTO revoked_tokens (token_hash) VALUES (?)',
      [bcrypt.hashSync(oldToken, 8)]
    );

    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Token refreshed successfully",
      data: {
        token: newToken
      }
    });

  } catch (error) {
    console.error(error);
    res.status(401).send({
      status: "failure",
      statusCode: 401,
      message: "Invalid token",
    });
  }
});

// Protected Route
app.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).send({
        status: "failure",
        statusCode: 401,
        message: "Authorization token required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [users] = await connection.promise().query(
      'SELECT id, email FROM web_users WHERE user_token = ? AND token_expiration > NOW()',
      [token]
    );

    if (!users.length) {
      return res.status(401).send({
        status: "failure",
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }

    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Profile retrieved successfully",
      data: {
        user: users[0]
      }
    });

  } catch (error) {
    console.error(error);
    res.status(401).send({
      status: "failure",
      statusCode: 401,
      message: "Invalid token",
    });
  }
});

// Logout
app.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).send({
        status: "failure",
        statusCode: 401,
        message: "Authorization token required",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    await connection.promise().query(
      'UPDATE web_users SET user_token = NULL, token_expiration = NULL, logged_in = 0 WHERE id = ?',
      [decoded.id]
    );

    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(401).send({
      status: "failure",
      statusCode: 401,
      message: "Invalid token",
    });
  }
});




const getAllSections = async (isActive) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM section`;
    let values = [];
    
    if (isActive !== null) {
      sql += ` WHERE is_active = ?`;
      values.push(isActive);
    }
    
    sql += ` ORDER BY display_order ASC`;

    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
       
        resolve(result);
      }
    });
  });
};

const getAllSubSections = async (isActive, hotelId, subHotelId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM sub_section WHERE 1=1`;
    let values = [];

    if (isActive) {
      sql += ` AND is_active = ?`;
      values.push(isActive);
    }

    if (hotelId) {
      sql += ` AND hotel_id = ?`;
      values.push(hotelId);
    }

    if (subHotelId) {
      sql += ` AND sub_hotel_id = ?`;
      values.push(subHotelId);
    }

    sql += ` ORDER BY display_order ASC`;

    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};




// app.get('/v9/getAllSections', authMiddleware, async (req, res) => { 
  app.get('/v9/getAllSections', async (req, res) => { 
  try {
    const { isActive } = req.query;
    const result = await getAllSections(isActive);
    // console.log("Sections retrieved successfully", result);

const homeSection = result.find(section => section.name === "Home");

const images = homeSection?.content?.images?.image1 ?? "No images found in Home section";

console.log(images);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Successfully retrieved sections",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      status: "failure",
      statusCode: 403,
      message: "Failed",
    });
  }
});

app.get('/v9/getAllSubSections', async (req, res) => {
  try {
    const { isActive, hotelId, subHotelId } = req.query;

    const result = await getAllSubSections(isActive, hotelId, subHotelId);

    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Successfully retrieved sub-sections",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      status: "failure",
      statusCode: 403,
      message: "Failed to retrieve sub-sections",
    });
  }
});




