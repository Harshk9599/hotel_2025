require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { URLSearchParams } = require('url');
const { DateTime } = require('luxon');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gmail transporter setup using App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Route to get keyboard password
app.post('/submit', (req, res) => {
  const client_id = process.env.CLIENT_ID;
  const access_token = process.env.ACCESS_TOKEN;
  const lock_id = process.env.LOCK_ID;
  const keyboard_pwd_type = '3';
  const keyboard_pwd_name = 'test1';

  const startDateTime = DateTime.fromFormat(`${req.body.startDate} ${req.body.startTime}`, 'yyyy-MM-dd HH:mm');
  const endDateTime = DateTime.fromFormat(`${req.body.endDate} ${req.body.endTime}`, 'yyyy-MM-dd HH:mm');

  const startTimestamp = startDateTime.toMillis();
  const endTimestamp = endDateTime.toMillis();
  const now = DateTime.now().toMillis();

  const data = new URLSearchParams({
    clientId: client_id,
    accessToken: access_token,
    lockId: lock_id,
    keyboardPwdType: keyboard_pwd_type,
    keyboardPwdName: keyboard_pwd_name,
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
    apiRes.on('data', chunk => responseData += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        console.log("API Response:", parsed); // Debug line

        if (!parsed.keyboardPwd) {
          return res.status(400).json({ error: 'keyboardPwd not returned by API', details: parsed });
        }

        res.json({ keyboardPwd: parsed.keyboardPwd });
      } catch (err) {
        console.error('Parse error:', err);
        res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  });

  apiReq.on('error', (error) => {
    console.error('API Error:', error);
    res.status(500).send('Internal Server Error');
  });

  apiReq.write(data);
  apiReq.end();
});

// Route to send OTP via email
app.post('/send-otp', (req, res) => {
  const { email, keyboardPwd, startDate, startTime, endDate, endTime } = req.body;

  if (!email || !keyboardPwd || !startDate || !startTime || !endDate || !endTime) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const mailOptions = {
    from: `"Hotel Booking" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your Keyboard Password (OTP)',
    text: `Hello Sir, Your hotel booking from ${startDate} ${startTime} to ${endDate} ${endTime} is successfully done. Your OTP is: ${keyboardPwd}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email' });
    }
    console.log('Email sent:', info.response);
    res.json({ success: true });
  });
});

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Optional: Handle favicon.ico to avoid 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});



// ******
// 

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
