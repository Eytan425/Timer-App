const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const clockInBtn = document.getElementById('clockInBtn');
const timeText = document.getElementById('timeText'); // Display time summary
let UserEmail;
let totalTimeInDecimals;
let timerId; // Store the timer ID
let seconds = 0, minutes = 0, hours = 0; // Initialize counters

// Variables to accumulate total worked time across sessions
let totalSeconds = 0, totalMinutes = 0, totalHours = 0;

registerBtn.addEventListener('click', () => {
  container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
  container.classList.remove("active");
});

// Clock in and Clock out
clockInBtn.addEventListener('click', async () => {
  if (clockInBtn.value === "Clock In") {
    // Start the timer for the session
    timerId = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      if (minutes === 60) {
        hours++;
        minutes = 0;
      }

      console.log(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    clockInBtn.value = "Clock Out";
  } else {
    // Stop the timer and accumulate time
    clearInterval(timerId);
    totalSeconds += seconds;
    totalMinutes += minutes;
    totalHours += hours;

    // Handle overflow of seconds and minutes
    if (totalSeconds >= 60) {
      totalMinutes += Math.floor(totalSeconds / 60);
      totalSeconds %= 60;
    }
    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }
    
    // Calculate the total time worked in decimals
    totalTimeInDecimals = totalHours + (totalMinutes / 60) + (totalSeconds / 3600);
    timeText.innerHTML = `You worked today: ${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

    console.log('Clocked Out');
    seconds = 0; minutes = 0; hours = 0; // Reset session counters
    clockInBtn.value = "Clock In";
  }
});

// Function to log time to the server
async function logTime(UserEmail, totalTimeInDecimals) {
  try {
    const response = await fetch("http://localhost:3000/user/auth/logTimes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: UserEmail, timeWorked: totalTimeInDecimals }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Logged time successfully!");
    } else {
      alert(data.message || 'Failed to log time.');
    }
  } catch (error) {
    console.error("Error logging time: ", error);
    alert("An error occurred while logging the time. Please try again.");
  }
}

// Registration function
async function register() {
  const signUpName = document.getElementById("signUpName").value;
  const signUpEmail = document.getElementById("signUpEmail").value;
  const signUpPassword = document.getElementById("signUpPassword").value;

  try {
    const response = await fetch("http://localhost:3000/user/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        timeWorked: 0,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      //alert("Registration successful!"); // Inform the user about the successful registration
      container.classList.remove("active");
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (error) {
    console.error("Error registering user:", error);
    alert("An error occurred during registration. Please try again.");
  }
}


// Sign-in function
async function signIn() {
  const signInEmail = document.getElementById('signInEmail').value;
  const signInPassword = document.getElementById('signInPassword').value;

  try {
    const response = await fetch("http://localhost:3000/user/auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: signInEmail, password: signInPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      UserEmail = signInEmail;
      clockInBtn.removeAttribute("hidden"); // Show the clock in button
      console.log("User Data:", data);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Invalid credentials');
      clockInBtn.setAttribute("hidden", 'true'); // Hide the clock in button if login fails
    }
  } catch (error) {
    console.error("Error signing in:", error);
    alert("An error occurred during sign-in. Please try again.");
  }
}
document.addEventListener("keydown", async function(event) {
  if (event.key === "Enter") {
    const activeElement = document.activeElement;
    if (activeElement.id === "signUpName" || activeElement.id === "signUpEmail" || activeElement.id === "signUpPassword") {
      const signUpName = document.getElementById("signUpName").value;
      const signUpEmail = document.getElementById("signUpEmail").value;
      const signUpPassword = document.getElementById("signUpPassword").value;

      if (signUpName && signUpEmail && signUpPassword) {
        await register();
      } else {
        alert("Please fill in all fields.");
      }
    } else if (activeElement.id === "signInEmail" || activeElement.id === "signInPassword") {
      const signInEmail = document.getElementById('signInEmail').value;
      const signInPassword = document.getElementById('signInPassword').value;

      if (signInEmail && signInPassword) {
        await signIn();
      } else {
        alert("Please fill in all fields.");
      }
    }
  }
});
// Attach event listeners
signUpBtn.addEventListener('click', register);
signInBtn.addEventListener('click', signIn);
