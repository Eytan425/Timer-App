const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const clockInBtn = document.getElementById('clockInBtn');



registerBtn.addEventListener('click', () => {
  container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
  container.classList.remove("active");
});

let timerId; // Store the timer ID
let seconds = 0; // Initialize seconds counter
let minutes = 0; // Initialize minutes counter
let hours = 0; // Initialize hours counter

// Variables to accumulate total worked time across sessions
let totalSeconds = 0;
let totalMinutes = 0;
let totalHours = 0;


const timeText = document.getElementById('timeText'); // Display time summary

clockInBtn.addEventListener('click', () => {
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

      console.log(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    clockInBtn.value = "Clock Out";
  } else {
    // Stop the timer and accumulate time
    clearInterval(timerId);

    // Add session time to total time
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

    // Display the accumulated total time worked
    timeText.innerHTML = `You worked today: ${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

    console.log('Clocked Out');

    // Reset the session time counters (not the total)
    seconds = 0;
    minutes = 0;
    hours = 0;

    clockInBtn.value = "Clock In";
  }
});




async function register() {
  const signUpName = document.getElementById("signUpName").value;
  const signUpEmail = document.getElementById("signUpEmail").value;
  const signUpPassword = document.getElementById("signUpPassword").value;

  try {
    // Send a POST request to the backend (updated endpoint)
    const response = await fetch("http://localhost:3000/user/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`User registered successfully!`);
      container.classList.remove("active");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error registering user:", error);
    alert("An error occurred during registration. Please try again.\n" + error);
  }
}

async function signIn() {
  const signInEmail = document.getElementById('signInEmail').value;
  const signInPassword = document.getElementById('signInPassword').value;

  try {
    // Send a POST request to the backend (correct endpoint)
    const response = await fetch("http://localhost:3000/user/auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    });

    const data = await response.json(); // Parse the response body

    if (response.ok) {
      alert(`User signed in successfully!`);
      console.log("User Data:", data);
      clockInBtn.removeAttribute("hidden");
      
    } else {
      alert(data.message || 'Invalid credentials');
      clockInBtn.setAttribute("hidden", 'true'); // Show error message from backend
    }

  } catch (error) {
    console.error("Error signing in:", error);
    alert("An error occurred during sign-in. Please try again.\n" + error.message);
  }
}


// Attach the event listener to the signUpButton
signUpBtn.addEventListener('click', register);
signInBtn.addEventListener('click', signIn);
