fetch('https://euapi.sciener.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      clientId: '9d04152e731c40228a7399d83ffe1a1d',
      clientSecret: 'e805445641ba03e86f8f97974b9c706d',
      grant_type: 'refresh_token',
      refresh_token: '091c2d1273349da47cefb68bda2aba9e'
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  