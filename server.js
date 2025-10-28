require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { URLSearchParams } = require('url');
const { DateTime } = require('luxon');
const path = require('path');
const sgMail = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Send email via SendGrid
const sendKeyboardPwdEmail = async (email, keyboardPwd, startDate, startTime, endDate, endTime) => {
  const msg = {
    to: email,
    from: {
      email: process.env.SENDER_EMAIL,
      name: 'Hotel Booking'
    },
    subject: 'Your Hotel Room OTP',
    text: `Your hotel booking from ${startDate} ${startTime} to ${endDate} ${endTime} was done successfully.\n\nHere is your OTP for your room: ${keyboardPwd}`
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent to:', email);
  } catch (err) {
    console.error('❌ SendGrid email error:', err.response?.body || err);
    throw err;
  }
};

// ✅ OTP Generation
app.post('/submit', (req, res) => {
  const { startDate, startTime, endDate, endTime } = req.body;

  const startDateTime = DateTime.fromFormat(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm', { zone: 'Asia/Kolkata' });
  const endDateTime = DateTime.fromFormat(`${endDate} ${endTime}`, 'yyyy-MM-dd HH:mm', { zone: 'Asia/Kolkata' });

  const startTimestamp = startDateTime.toMillis();
  const endTimestamp = endDateTime.toMillis();
  const now = DateTime.now().setZone('Asia/Kolkata').toMillis();

  const data = new URLSearchParams({
    clientId: process.env.CLIENT_ID,
    accessToken: process.env.ACCESS_TOKEN,
    lockId: process.env.LOCK_ID,
    keyboardPwdType: '3',
    keyboardPwdName: 'test1',
    startDate: startTimestamp,
    endDate: endTimestamp,
    date: now
  }).toString();

  const options = {
    hostname: 'euapi.sciener.com',
    path: '/v3/keyboardPwd/get',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length
    }
  };

  const apiReq = https.request(options, (apiRes) => {
    let responseData = '';

    apiRes.on('data', chunk => {
      responseData += chunk;
    });

    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        const keyboardPwd = parsed.keyboardPwd;
        console.log('🔢 OTP Generated:', keyboardPwd);
        res.json({ keyboardPwd });
      } catch (e) {
        console.error('❌ Failed to parse API response:', e);
        res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  });

  apiReq.on('error', error => {
    console.error('❌ API request error:', error);
    res.status(500).json({ error: 'API request error' });
  });

  apiReq.write(data);
  apiReq.end();
});

// ✅ Send OTP via email
app.post('/send-otp', (req, res) => {
  const { email, keyboardPwd, startDate, startTime, endDate, endTime } = req.body;

  if (!email || !keyboardPwd || !startDate || !startTime || !endDate || !endTime) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  console.log('📧 Sending email to:', email);
  sendKeyboardPwdEmail(email, keyboardPwd, startDate, startTime, endDate, endTime)
    .then(() => res.json({ success: true }))
    .catch(() => res.status(500).json({ success: false, message: 'Failed to send email' }));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});



// ********************************************************************************************************************************************************************
// SMTP Server type code but blocked by render works on local host


// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const https = require('https');
// const { URLSearchParams } = require('url');
// const { DateTime } = require('luxon');
// const path = require('path');
// const nodemailer = require('nodemailer');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // ✅ Nodemailer setup (IPv4 + better logs)
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: { family: 4 } // 👈 important for Render
// });

// // ✅ Test transporter on startup
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ Email transporter error:', error);
//   } else {
//     console.log('✅ Email transporter ready');
//   }
// });

// // ✅ Send email function
// const sendKeyboardPwdEmail = async (email, keyboardPwd, startDate, startTime, endDate, endTime) => {
//   const mailOptions = {
//     from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: 'Your Hotel Room OTP',
//     text: `Your hotel booking from ${startDate} ${startTime} to ${endDate} ${endTime} was done successfully.\n\nHere is your OTP for your room: ${keyboardPwd}`
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Email sent to:', email, info.response);
//   } catch (err) {
//     console.error('❌ Email send error:', err);
//     throw err;
//   }
// };

// // ✅ Main route to generate OTP
// app.post('/submit', (req, res) => {
//   const { startDate, startTime, endDate, endTime } = req.body;

//   const startDateTime = DateTime.fromFormat(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm', { zone: 'Asia/Kolkata' });
//   const endDateTime = DateTime.fromFormat(`${endDate} ${endTime}`, 'yyyy-MM-dd HH:mm', { zone: 'Asia/Kolkata' });

//   const startTimestamp = startDateTime.toMillis();
//   const endTimestamp = endDateTime.toMillis();
//   const now = DateTime.now().setZone('Asia/Kolkata').toMillis();

//   const data = new URLSearchParams({
//     clientId: process.env.CLIENT_ID,
//     accessToken: process.env.ACCESS_TOKEN,
//     lockId: process.env.LOCK_ID,
//     keyboardPwdType: '3',
//     keyboardPwdName: 'test1',
//     startDate: startTimestamp,
//     endDate: endTimestamp,
//     date: now
//   }).toString();

//   const options = {
//     hostname: 'euapi.sciener.com',
//     path: '/v3/keyboardPwd/get',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Content-Length': data.length
//     }
//   };

//   const apiReq = https.request(options, (apiRes) => {
//     let responseData = '';

//     apiRes.on('data', chunk => {
//       responseData += chunk;
//     });

//     apiRes.on('end', () => {
//       try {
//         const parsed = JSON.parse(responseData);
//         const keyboardPwd = parsed.keyboardPwd;

//         console.log('🔢 OTP Generated:', keyboardPwd);
//         res.json({ keyboardPwd }); // send OTP to frontend
//       } catch (e) {
//         console.error('❌ Failed to parse API response:', e);
//         res.status(500).json({ error: 'Failed to parse API response' });
//       }
//     });
//   });

//   apiReq.on('error', error => {
//     console.error('❌ API request error:', error);
//     res.status(500).json({ error: 'API request error' });
//   });

//   apiReq.write(data);
//   apiReq.end();
// });

// // ✅ Email sender endpoint
// app.post('/send-otp', (req, res) => {
//   const { email, keyboardPwd, startDate, startTime, endDate, endTime } = req.body;

//   if (!email || !keyboardPwd || !startDate || !startTime || !endDate || !endTime) {
//     return res.status(400).json({ success: false, message: 'Missing required fields' });
//   }

//   console.log('📧 Attempting to send email to:', email);

//   sendKeyboardPwdEmail(email, keyboardPwd, startDate, startTime, endDate, endTime)
//     .then(() => res.json({ success: true }))
//     .catch((err) => {
//       console.error('❌ Failed to send email:', err);
//       res.status(500).json({ success: false, message: 'Failed to send email' });
//     });
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.listen(port, () => {
//   console.log(`🚀 Server running at http://localhost:${port}`);
// });


// LOCAL WORKS FINE ENDS

// ********************************************************************************************************************************************************************



// ********************************************************************************************************************************************************************

// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const https = require('https');
// const { URLSearchParams } = require('url');
// const { DateTime } = require('luxon');
// const path = require('path');
// const nodemailer = require('nodemailer');

// const app = express();
// const port = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS
//   }
// });

// // Send email
// const sendKeyboardPwdEmail = async (email, keyboardPwd, startDate, startTime, endDate, endTime) => {
//   const mailOptions = {
//     from: `"Your Company" <${process.env.GMAIL_USER}>`,
//     to: email,
//     subject: 'Your Hotel Room OTP',
//     text: `Your hotel booking from ${startDate} ${startTime} to ${endDate} ${endTime} was done successfully. Here is your OTP for your room: ${keyboardPwd}`
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent to:', email);
//   } catch (err) {
//     console.error('Email send error:', err);
//     throw err;
//   }
// };

// // Main route to generate OTP
// app.post('/submit', (req, res) => {
//   const { startDate, startTime, endDate, endTime } = req.body;

//   const startDateTime = DateTime.fromFormat(
//     `${startDate} ${startTime}`,
//     'yyyy-MM-dd HH:mm',
//     { zone: 'Asia/Kolkata' }
//   );

//   const endDateTime = DateTime.fromFormat(
//     `${endDate} ${endTime}`,
//     'yyyy-MM-dd HH:mm',
//     { zone: 'Asia/Kolkata' }
//   );

//   const startTimestamp = startDateTime.toMillis();
//   const endTimestamp = endDateTime.toMillis();
//   const now = DateTime.now().setZone('Asia/Kolkata').toMillis();

//   const data = new URLSearchParams({
//     clientId: process.env.CLIENT_ID,
//     accessToken: process.env.ACCESS_TOKEN,
//     lockId: process.env.LOCK_ID,
//     keyboardPwdType: '3',
//     keyboardPwdName: 'test1',
//     startDate: startTimestamp,
//     endDate: endTimestamp,
//     date: now
//   }).toString();

//   const options = {
//     hostname: 'euapi.sciener.com',
//     path: '/v3/keyboardPwd/get',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Content-Length': data.length
//     }
//   };

//   const apiReq = https.request(options, (apiRes) => {
//     let responseData = '';

//     apiRes.on('data', chunk => {
//       responseData += chunk;
//     });

//     apiRes.on('end', () => {
//       try {
//         const parsed = JSON.parse(responseData);
//         const keyboardPwd = parsed.keyboardPwd;

//         res.json({ keyboardPwd }); // send to client
//       } catch (e) {
//         console.error('Failed to parse API response:', e);
//         res.status(500).json({ error: 'Failed to parse API response' });
//       }
//     });
//   });

//   apiReq.on('error', error => {
//     console.error('API request error:', error);
//     res.status(500).json({ error: 'API request error' });
//   });

//   apiReq.write(data);
//   apiReq.end();
// });

// // Email sender endpoint
// app.post('/send-otp', (req, res) => {
//   const { email, keyboardPwd, startDate, startTime, endDate, endTime } = req.body;

//   if (!email || !keyboardPwd || !startDate || !startTime || !endDate || !endTime) {
//     return res.status(400).json({ success: false, message: 'Missing required fields' });
//   }

//   sendKeyboardPwdEmail(email, keyboardPwd, startDate, startTime, endDate, endTime)
//     .then(() => res.json({ success: true }))
//     .catch(() => res.status(500).json({ success: false, message: 'Failed to send email' }));
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.listen(process.env.PORT || port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });


// ********************************************************************************************************************************************************************





// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const https = require('https');
// const { URLSearchParams } = require('url');
// const { DateTime } = require('luxon');
// const path = require('path');
// const nodemailer = require('nodemailer');

// const app = express();
// const port = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json()); // needed to handle JSON payload from client
// app.use(express.static(path.join(__dirname, 'public')));

// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER, // your Gmail ID
//     pass: process.env.GMAIL_PASS  // your app password from Google
//   }
// });

// // Send email function
// const sendKeyboardPwdEmail = async (email, keyboardPwd) => {
//   const mailOptions = {
//     from: `"Your Company" <${process.env.GMAIL_USER}>`,
//     to: email,
//     subject: 'Your Keyboard Password',
//     text: `Your keyboard password is: ${keyboardPwd}`
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent to:', email);
//   } catch (err) {
//     console.error('Email send error:', err);
//   }
// };

// // Route to get keyboard password and send email
// app.post('/submit', (req, res) => {
//   const { startDate, startTime, endDate, endTime } = req.body;

//   const startDateTime = DateTime.fromFormat(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm');
//   const endDateTime = DateTime.fromFormat(`${endDate} ${endTime}`, 'yyyy-MM-dd HH:mm');

//   const startTimestamp = startDateTime.toMillis();
//   const endTimestamp = endDateTime.toMillis();
//   const now = DateTime.now().toMillis();

//   const data = new URLSearchParams({
//     clientId: process.env.CLIENT_ID,
//     accessToken: process.env.ACCESS_TOKEN,
//     lockId: process.env.LOCK_ID,
//     keyboardPwdType: '3',
//     keyboardPwdName: 'test1',
//     startDate: startTimestamp,
//     endDate: endTimestamp,
//     date: now
//   }).toString();

//   const options = {
//     hostname: 'euapi.sciener.com',
//     path: '/v3/keyboardPwd/get',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Content-Length': data.length
//     }
//   };

//   const apiReq = https.request(options, (apiRes) => {
//     let responseData = '';

//     apiRes.on('data', chunk => {
//       responseData += chunk;
//     });

//     apiRes.on('end', () => {
//       try {
//         const parsed = JSON.parse(responseData);
//         const keyboardPwd = parsed.keyboardPwd;

//         res.json({ keyboardPwd }); // Send to client

//         // Ask for email and send (Client handles this part)
//       } catch (e) {
//         console.error('Failed to parse API response:', e);
//         res.status(500).json({ error: 'Failed to parse API response' });
//       }
//     });
//   });

//   apiReq.on('error', error => {
//     console.error('API request error:', error);
//     res.status(500).json({ error: 'API request error' });
//   });

//   apiReq.write(data);
//   apiReq.end();
// });

// // Route to send email with keyboardPwd
// app.post('/send-otp', (req, res) => {
//   const { email, keyboardPwd } = req.body;

//   if (!email || !keyboardPwd) {
//     return res.status(400).json({ success: false, message: 'Missing email or keyboardPwd' });
//   }

//   sendKeyboardPwdEmail(email, keyboardPwd)
//     .then(() => res.json({ success: true }))
//     .catch(() => res.status(500).json({ success: false, message: 'Failed to send email' }));
// });

// // Serve main HTML
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.listen(process.env.PORT || port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });






// ******
// 888

// const express = require('express');
// const bodyParser = require('body-parser');
// const https = require('https');
// const { URLSearchParams } = require('url');
// const { DateTime } = require('luxon');
// const path = require('path');

// const app = express();
// const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public')); // Serve static files from the 'public' directory

// app.post('/submit', (req, res) => {
//   // Your existing code for handling form submission and making API call
//   const client_id = '9d04152e731c40228a7399d83ffe1a1d';
//   const access_token = '28eeec05fee7c302c1946b6bc8ce2ce5';
//   const lock_id = '11816438';
//   const keyboard_pwd_type = '3';
//   const keyboard_pwd_name = 'test1';

//   const start_date = req.body.startDate;
//   const start_time = req.body.startTime;
//   const end_date = req.body.endDate;
//   const end_time = req.body.endTime;

//   // Combine start date and time
//   const start_date_time = DateTime.fromFormat(`${start_date} ${start_time}`, 'yyyy-MM-dd HH:mm');

//   // Combine end date and time
//   const end_date_time = DateTime.fromFormat(`${end_date} ${end_time}`, 'yyyy-MM-dd HH:mm');

//   // Convert to Unix timestamp in milliseconds
//   const start_timestamp_ms = start_date_time.toMillis();
//   const end_timestamp_ms = end_date_time.toMillis();

//   // Get current datetime
//   const current_datetime = DateTime.now();

//   // Convert current datetime to Unix timestamp in milliseconds
//   const current_timestamp_ms = current_datetime.toMillis();

//   const data = new URLSearchParams({
//     'clientId': client_id,
//     'accessToken': access_token,
//     'lockId': lock_id,
//     'keyboardPwdType': keyboard_pwd_type,
//     'keyboardPwdName': keyboard_pwd_name,
//     'startDate': start_timestamp_ms,
//     'endDate': end_timestamp_ms,
//     'date': current_timestamp_ms
//   }).toString();

//   const options = {
//     hostname: 'euapi.sciener.com',
//     path: '/v3/keyboardPwd/get',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Content-Length': data.length
//     }
//   };

//   const request = https.request(options, (response) => {
//     let responseData = '';

//     response.on('data', (chunk) => {
//       responseData += chunk;
//     });

//     response.on('end', () => {
//       res.send(responseData);
//     });
//   });

//   request.on('error', (error) => {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   });

//   request.write(data);
//   request.end();
// });

// // Serve index_new.html for the root URL
// // app.get('/', (req, res) => {
// //   res.sendFile(__dirname + '/public/index.html');
// // });

// // Serve index_new.html for the root URL
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname,  'index.html'));
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });






// const express = require('express');
// const bodyParser = require('body-parser');
// const https = require('https');
// const { URLSearchParams } = require('url');
// const { DateTime } = require('luxon');

// const app = express();
// const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index_new.html');
// });

// app.post('/submit', (req, res) => {
//   const client_id = '9d04152e731c40228a7399d83ffe1a1d';
//   const access_token = '28eeec05fee7c302c1946b6bc8ce2ce5';
//   const lock_id = '11816438';
//   const keyboard_pwd_type = '3';
//   const keyboard_pwd_name = 'test1';

//   const start_date = req.body.startDate;
//   const start_time = req.body.startTime;
//   const end_date = req.body.endDate;
//   const end_time = req.body.endTime;

//   // Combine start date and time
//   const start_date_time = DateTime.fromFormat(`${start_date} ${start_time}`, 'yyyy-MM-dd HH:mm');

//   // Combine end date and time
//   const end_date_time = DateTime.fromFormat(`${end_date} ${end_time}`, 'yyyy-MM-dd HH:mm');

//   // Convert to Unix timestamp in milliseconds
//   const start_timestamp_ms = start_date_time.toMillis();
//   const end_timestamp_ms = end_date_time.toMillis();

//   // Get current datetime
//   const current_datetime = DateTime.now();

//   // Convert current datetime to Unix timestamp in milliseconds
//   const current_timestamp_ms = current_datetime.toMillis();

//   const data = new URLSearchParams({
//     'clientId': client_id,
//     'accessToken': access_token,
//     'lockId': lock_id,
//     'keyboardPwdType': keyboard_pwd_type,
//     'keyboardPwdName': keyboard_pwd_name,
//     'startDate': start_timestamp_ms,
//     'endDate': end_timestamp_ms,
//     'date': current_timestamp_ms
//   }).toString();

//   const options = {
//     hostname: 'euapi.sciener.com',
//     path: '/v3/keyboardPwd/get',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Content-Length': data.length
//     }
//   };

//   const request = https.request(options, (response) => {
//     let responseData = '';

//     response.on('data', (chunk) => {
//       responseData += chunk;
//     });

//     response.on('end', () => {
//       res.send(responseData);
//     });
//   });

//   request.on('error', (error) => {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   });

//   request.write(data);
//   request.end();
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });
