document.getElementById('timestampForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const startDate = document.getElementById('startDate').value;
  const startTime = document.getElementById('startTime').value;
  const endDate = document.getElementById('endDate').value;
  const endTime = document.getElementById('endTime').value;

  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ startDate, startTime, endDate, endTime })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error('Server Error:', data.error);
      alert('Failed to generate keyboard password');
    } else {
      document.getElementById('response').textContent = data.keyboardPwd;
      
      const email = prompt("Enter your email to receive the keyboard password:");
      if (!email) return;

      fetch('/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          keyboardPwd: data.keyboardPwd,
          startDate,
          startTime,
          endDate,
          endTime
        })
      })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          alert("Email sent successfully!");
        } else {
          alert("Email failed: " + res.message);
        }
      })
      .catch(error => {
        console.error("Email sending failed:", error);
      });
    }
  })
  .catch(error => {
    console.error('Client Error:', error);
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
  