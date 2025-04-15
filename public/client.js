document.getElementById('timestampForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const startDate = document.getElementById('startDate').value;
  const startTime = document.getElementById('startTime').value;
  const endDate = document.getElementById('endDate').value;
  const endTime = document.getElementById('endTime').value;

  // Make POST request to /submit to get keyboardPwd data
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ startDate, startTime, endDate, endTime })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error || !data.keyboardPwd) {
      console.error('Server Error:', data.error || 'No keyboard password returned.');
      alert('Failed to generate keyboard password. Please try again.');
      return;
    }

    // Display the keyboard password
    console.log("Keyboard Password:", data.keyboardPwd);
    document.getElementById('response').textContent = `${data.keyboardPwd}`;

    // Ask for user's email
    const email = prompt("Enter your email to receive the keyboard password:");
    if (!email) return;

    // Send keyboardPwd via email with the required fields
    fetch('/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        keyboardPwd: data.keyboardPwd,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime
      }),
    })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.success) {
        console.log("Email sent successfully.");
        alert("Keyboard password sent to your email!");
      } else {
        console.error("Email sending failed:", responseData.message);
        alert("Failed to send email.");
      }
    })
    .catch(error => {
      console.error("Error sending email:", error);
      alert("Error occurred while sending email.");
    });
  })
  .catch(error => {
    console.error('Client Error:', error);
    alert('Something went wrong. Please try again.');
  });
});

// document.getElementById('timestampForm').addEventListener('submit', function(event) {
//   event.preventDefault();
  
//   const startDate = document.getElementById('startDate').value;
//   const startTime = document.getElementById('startTime').value;
//   const endDate = document.getElementById('endDate').value;
//   const endTime = document.getElementById('endTime').value;

//   // Make POST request to server
//   fetch('/submit', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: new URLSearchParams({ startDate, startTime, endDate, endTime })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.error) {
//       // Handle server error
//       console.error('Server Error:', data.error);
//     } else {
//       // Update HTML with server response
//       document.getElementById('response').textContent = data.response;
//     }
//   })
//   .catch(error => {
//     console.error('Client Error:', error);
//   });
// });




// document.getElementById('timestampForm').addEventListener('submit', function(event) {
//     event.preventDefault();
    
//     const startDate = document.getElementById('startDate').value;
//     const startTime = document.getElementById('startTime').value;
//     const endDate = document.getElementById('endDate').value;
//     const endTime = document.getElementById('endTime').value;
  
//     // Make POST request to server
//     fetch('/submit', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({ startDate, startTime, endDate, endTime })
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.error) {
//         // Handle server error
//         console.error('Server Error:', data.error);
//       } else {
//         // Update HTML with server response
//         document.getElementById('response').textContent = data.response;
//       }
//     })
//     .catch(error => {
//       console.error('Client Error:', error);
//     });
//   });
  


  





// document.getElementById('timestampForm').addEventListener('submit', function(event) {
//     event.preventDefault();
    
//     const startDate = document.getElementById('startDate').value;
//     const startTime = document.getElementById('startTime').value;
//     const endDate = document.getElementById('endDate').value;
//     const endTime = document.getElementById('endTime').value;
  
//     // Make POST request to server
//     fetch('/submit', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({ startDate, startTime, endDate, endTime })
//     })
//     .then(response => response.json())
//     .then(data => {
//       const responseDiv = document.getElementById('response');
//       responseDiv.innerHTML = `
//         <p>Start Timestamp: ${data.startTimestampMs}</p>
//         <p>End Timestamp: ${data.endTimestampMs}</p>
//         <p>Current Timestamp: ${data.currentTimestampMs}</p>
//       `;
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   });
  