// const fetch = require('node-fetch'); // Not needed in Node 18+, otherwise: npm install node-fetch


const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const url = 'https://euapi.sciener.com/oauth2/token';

// Replace these with your actual credentials
const clientId = '9d04152e731c40228a7399d83ffe1a1d';
const clientSecret = 'e805445641ba03e86f8f97974b9c706d';
const username = '+919667771077';
const password = 'sanat123';

const params = new URLSearchParams();
params.append('clientId', clientId);
params.append('clientSecret', clientSecret);
params.append('username', username);
params.append('password', password);

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: params,
})
  .then(res => res.json())
  .then(data => {
    console.log('Response:', data);
  })
  .catch(err => {
    console.error('Error:', err);
  });
