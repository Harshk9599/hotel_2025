const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to get keyboard password
app.post('/submit', async (req, res) => {
  const { startDate, startTime, endDate, endTime } = req.body;

  // Use Asia/Kolkata timezone
  const timeZone = "Asia/Kolkata";

  const startDateTime = moment.tz(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm', timeZone);
  const endDateTime = moment.tz(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm', timeZone);

  if (!startDateTime.isValid() || !endDateTime.isValid() || endDateTime.isSameOrBefore(startDateTime)) {
    return res.status(400).json({ error: "Invalid time range. Make sure end time is after start time." });
  }

  const startTimestamp = Math.floor(startDateTime.valueOf() / 1000);
  const endTimestamp = Math.floor(endDateTime.valueOf() / 1000);

  try {
    const apiResponse = await axios.post('https://euapi.ttlock.com/v3/keyboardPwd/add', null, {
      params: {
        clientId: 'YOUR_CLIENT_ID',
        accessToken: 'YOUR_ACCESS_TOKEN',
        lockId: 'YOUR_LOCK_ID',
        keyboardPwdType: 3,
        startDate: startTimestamp,
        endDate: endTimestamp,
        date: Date.now()
      }
    });

    const responseData = apiResponse.data;

    if (responseData.keyboardPwd) {
      res.json({ keyboardPwd: responseData.keyboardPwd });
    } else {
      res.status(500).json({ error: "keyboardPwd not returned by API", apiResponse: responseData });
    }
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get keyboardPwd", detail: error.response?.data || error.message });
  }
});

// Endpoint to send the keyboard password via email
app.post('/send-otp', async (req, res) => {
  const { email, keyboardPwd, startDate, startTime, endDate, endTime } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'YOUR_EMAIL@gmail.com',
      pass: 'YOUR_EMAIL_PASSWORD'
    }
  });

  const mailOptions = {
    from: 'YOUR_EMAIL@gmail.com',
    to: email,
    subject: 'Your Smart Lock Keyboard Password',
    html: `
      <p>Here is your keyboard password: <strong>${keyboardPwd}</strong></p>
      <p><strong>Start:</strong> ${startDate} ${startTime}</p>
      <p><strong>End:</strong> ${endDate} ${endTime}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});



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
