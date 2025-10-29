document.addEventListener("DOMContentLoaded", () => {
  let selectedPrice = 0;
  let selectedLock = "";

  const detailSection = document.getElementById("bookingDetails");
  const form = document.getElementById("bookingForm");

  // Room selection
  document.querySelectorAll(".room button").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedPrice = parseInt(btn.dataset.price);
      selectedLock = btn.dataset.lock;

      alert(`Selected ${btn.parentElement.querySelector("h3").textContent}`);
      detailSection.style.display = "block";
      window.scrollTo({ top: detailSection.offsetTop, behavior: "smooth" });
    });
  });

  // Payment and OTP
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;
    const email = document.getElementById("email").value;

    if (!selectedPrice || !selectedLock) {
      alert("Please select a room first!");
      return;
    }

    try {
      // Step 1: Create Razorpay Order
      const orderRes = await fetch("/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedPrice }),
      });
      const orderData = await orderRes.json();

      // Step 2: Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Smart Hotel Booking",
        description: "Room Booking Payment",
        order_id: orderData.order_id,
        handler: async function (response) {
          // Step 3: Verify Payment + Generate OTP
          const verifyRes = await fetch("/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              startDate,
              startTime,
              endDate,
              endTime,
              email,
              lockId: selectedLock,
            }),
          });

          const verifyData = await verifyRes.json();
          const responseBox = document.getElementById("response");

          if (verifyData.success) {
            responseBox.textContent = "✅ Payment successful! OTP sent to your email.";
          } else {
            responseBox.textContent = "❌ Payment verification failed!";
          }
        },
        theme: { color: "#4a90e2" },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    }
  });
});





// ********************************************************************************************************************************************************************


// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('timestampForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const startDate = document.getElementById('startDate').value;
//     const startTime = document.getElementById('startTime').value;
//     const endDate = document.getElementById('endDate').value;
//     const endTime = document.getElementById('endTime').value;

//     // Request to generate keyboardPwd
//     fetch('/submit', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({ startDate, startTime, endDate, endTime })
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.error || !data.keyboardPwd) {
//         console.error('Server Error:', data.error || 'No keyboard password returned.');
//         alert('Failed to generate keyboard password. Please try again.');
//         return;
//       }

//       // Show password
//       console.log("Keyboard Password:", data.keyboardPwd);
//       document.getElementById('response').textContent = `Keyboard Password: ${data.keyboardPwd}`;

//       // Ask for email
//       const email = prompt("Enter your email to receive the keyboard password:");
//       if (!email) return;

//       // Send to email
//       fetch('/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: email,
//           keyboardPwd: data.keyboardPwd,
//           startDate: startDate,
//           startTime: startTime,
//           endDate: endDate,
//           endTime: endTime
//         }),
//       })
//       .then(response => response.json())
//       .then(responseData => {
//         if (responseData.success) {
//           console.log("Email sent successfully.");
//           alert("Keyboard password sent to your email!");
//         } else {
//           console.error("Email sending failed:", responseData.message);
//           alert("Failed to send email.");
//         }
//       })
//       .catch(error => {
//         console.error("Error sending email:", error);
//         alert("Error occurred while sending email.");
//       });
//     })
//     .catch(error => {
//       console.error('Client Error:', error);
//       alert('Something went wrong. Please try again.');
//     });
//   });
// });



// ********************************************************************************************************************************************************************






// document.getElementById('timestampForm').addEventListener('submit', function(event) {
//   event.preventDefault();

//   const startDate = document.getElementById('startDate').value;
//   const startTime = document.getElementById('startTime').value;
//   const endDate = document.getElementById('endDate').value;
//   const endTime = document.getElementById('endTime').value;

//   // Make POST request to /submit to get keyboardPwd data
//   fetch('/submit', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: new URLSearchParams({ startDate, startTime, endDate, endTime })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.error || !data.keyboardPwd) {
//       console.error('Server Error:', data.error || 'No keyboard password returned.');
//       alert('Failed to generate keyboard password. Please try again.');
//       return;
//     }

//     // Display the keyboard password
//     console.log("Keyboard Password:", data.keyboardPwd);
//     document.getElementById('response').textContent = `${data.keyboardPwd}`;

//     // Ask for user's email
//     const email = prompt("Enter your email to receive the keyboard password:");
//     if (!email) return;

//     // Send keyboardPwd via email with the required fields
//     fetch('/send-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: email,
//         keyboardPwd: data.keyboardPwd,
//         startDate: startDate,
//         startTime: startTime,
//         endDate: endDate,
//         endTime: endTime
//       }),
//     })
//     .then(response => response.json())
//     .then(responseData => {
//       if (responseData.success) {
//         console.log("Email sent successfully.");
//         alert("Keyboard password sent to your email!");
//       } else {
//         console.error("Email sending failed:", responseData.message);
//         alert("Failed to send email.");
//       }
//     })
//     .catch(error => {
//       console.error("Error sending email:", error);
//       alert("Error occurred while sending email.");
//     });
//   })
//   .catch(error => {
//     console.error('Client Error:', error);
//     alert('Something went wrong. Please try again.');
//   });
// });







// document.getElementById('timestampForm').addEventListener('submit', function(event) {
//   event.preventDefault();

//   const startDate = document.getElementById('startDate').value;
//   const startTime = document.getElementById('startTime').value;
//   const endDate = document.getElementById('endDate').value;
//   const endTime = document.getElementById('endTime').value;

//   // Make POST request to /submit to get keyboardPwd data
//   fetch('/submit', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: new URLSearchParams({ startDate, startTime, endDate, endTime })
//   })
//   .then(async response => {
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Server responded with HTML or error: ${errorText}`);
//     }
//     return response.json();
//   })
//   .then(data => {
//     if (data.error || !data.keyboardPwd) {
//       console.error('Server Error:', data.error || 'No keyboard password returned.');
//       alert('Failed to generate keyboard password. Please try again.');
//       return;
//     }

//     // Display the keyboard password
//     console.log("Keyboard Password:", data.keyboardPwd);
//     document.getElementById('response').textContent = `${data.keyboardPwd}`;

//     // Ask for user's email
//     const email = prompt("Enter your email to receive the keyboard password:");
//     if (!email) return;

//     // Send keyboardPwd via email
//     fetch('/send-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: email,
//         keyboardPwd: data.keyboardPwd,
//         startDate: startDate,
//         startTime: startTime,
//         endDate: endDate,
//         endTime: endTime
//       }),
//     })
//     .then(async response => {
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Email server error: ${errorText}`);
//       }
//       return response.json();
//     })
//     .then(responseData => {
//       if (responseData.success) {
//         console.log("Email sent successfully.");
//         alert("Keyboard password sent to your email!");
//       } else {
//         console.error("Email sending failed:", responseData.message);
//         alert("Failed to send email.");
//       }
//     })
//     .catch(error => {
//       console.error("Error sending email:", error);
//       alert("Error occurred while sending email.");
//     });
//   })
//   .catch(error => {
//     console.error('Client Error:', error);
//     alert('Something went wrong. Please try again.');
//   });
// });




// 
// document.getElementById('timestampForm').addEventListener('submit', function(event) {
//   event.preventDefault();

//   const startDate = document.getElementById('startDate').value;
//   const startTime = document.getElementById('startTime').value;
//   const endDate = document.getElementById('endDate').value;
//   const endTime = document.getElementById('endTime').value;

//   // Make POST request to /submit to get keyboardPwd data
//   fetch('/submit', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: new URLSearchParams({ startDate, startTime, endDate, endTime })
//   })
//   .then(response => response.json())
//   .then(data => {
//     if (data.error || !data.keyboardPwd) {
//       console.error('Server Error:', data.error || 'No keyboard password returned.');
//       alert('Failed to generate keyboard password. Please try again.');
//       return;
//     }

//     // Display the keyboard password
//     console.log("Keyboard Password:", data.keyboardPwd);
//     document.getElementById('response').textContent = `${data.keyboardPwd}`;

//     // Ask for user's email
//     const email = prompt("Enter your email to receive the keyboard password:");
//     if (!email) return;

//     // Send keyboardPwd via email with the required fields
//     fetch('/send-otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: email,
//         keyboardPwd: data.keyboardPwd,
//         startDate: startDate,
//         startTime: startTime,
//         endDate: endDate,
//         endTime: endTime
//       }),
//     })
//     .then(response => response.json())
//     .then(responseData => {
//       if (responseData.success) {
//         console.log("Email sent successfully.");
//         alert("Keyboard password sent to your email!");
//       } else {
//         console.error("Email sending failed:", responseData.message);
//         alert("Failed to send email.");
//       }
//     })
//     .catch(error => {
//       console.error("Error sending email:", error);
//       alert("Error occurred while sending email.");
//     });
//   })
//   .catch(error => {
//     console.error('Client Error:', error);
//     alert('Something went wrong. Please try again.');
//   });
// });













// document.getElementById('timestampForm').addEventListener('submit', function(event) {
//   event.preventDefault();
  
//   const startDate = document.getElementById('startDate').value;
//   const startTime = document.getElementById('startTime').value;
//   const endDate = document.getElementById('endDate').value;
//   const endTime = document.getElementById('endTime').value;

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
//       console.error('Server Error:', data.error);
//       alert('Failed to generate keyboard password');
//     } else {
//       document.getElementById('response').textContent = data.keyboardPwd;
      
//       const email = prompt("Enter your email to receive the keyboard password:");
//       if (!email) return;

//       fetch('/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           email,
//           keyboardPwd: data.keyboardPwd,
//           startDate,
//           startTime,
//           endDate,
//           endTime
//         })
//       })
//       .then(response => response.json())
//       .then(res => {
//         if (res.success) {
//           alert("Email sent successfully!");
//         } else {
//           alert("Email failed: " + res.message);
//         }
//       })
//       .catch(error => {
//         console.error("Email sending failed:", error);
//       });
//     }
//   })
//   .catch(error => {
//     console.error('Client Error:', error);
//   });
// });




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
  
