document.getElementById('timestampForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const API_BASE = 'https://hotel-2025.onrender.com';

  const startDate = document.getElementById('startDate').value;
  const startTime = document.getElementById('startTime').value;
  const endDate = document.getElementById('endDate').value;
  const endTime = document.getElementById('endTime').value;

  // Convert to ISO string manually in Asia/Kolkata timezone
  const start = new Date(`${startDate}T${startTime}:00+05:30`);  // Using +05:30 for Kolkata timezone
  const end = new Date(`${endDate}T${endTime}:00+05:30`);  // Using +05:30 for Kolkata timezone

  // Check if end time is after start time
  if (start >= end) {
    alert("End time must be after start time.");
    return;
  }

  // Log the times being sent
  console.log("Start Time:", start);
  console.log("End Time:", end);

  // Make POST request to /submit
  fetch(`${API_BASE}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      startDate,
      startTime,
      endDate,
      endTime
    })
  })
  .then(async response => {
    // Check for non-JSON responses like HTML errors
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }

    // If the response is not JSON, log and throw error
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      const textResponse = await response.text();  // Get the raw text
      throw new Error(`Invalid response format. Expected JSON, got: ${textResponse.substring(0, 100)}...`);
    }
  })
  .then(data => {
    // Handle the response data
    if (data.error || !data.keyboardPwd) {
      console.error('Server Error:', data.error || 'No keyboard password returned.');
      alert('Failed to generate keyboard password. Please try again.');
      return;
    }

    console.log("Keyboard Password:", data.keyboardPwd);
    document.getElementById('response').textContent = `${data.keyboardPwd}`;

    const email = prompt("Enter your email to receive the keyboard password:");
    if (!email) return;

    // Send email with OTP
    fetch(`${API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        keyboardPwd: data.keyboardPwd,
        startDate,
        startTime,
        endDate,
        endTime
      }),
    })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.success) {
        alert("Keyboard password sent to your email!");
      } else {
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
    alert(`Error: ${error.message}`);
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
  