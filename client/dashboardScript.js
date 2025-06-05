let totalTimeInDecimals;
let timerId; // Store the timer ID
let startTime; // Store the start time
let totalSeconds = 0, totalMinutes = 0, totalHours = 0;
import { UserEmail } from './script.js';

// Get the user email from localStorage
const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
    window.location.href = 'index.html'; // Redirect to login if no email found
}

//Get the signUpName
const signUpName = localStorage.getItem('signUpName');
if (signUpName) {
    document.getElementById('userName').textContent = signUpName;
} else {
    document.getElementById('userName').textContent = 'Guest';
}

//Sign out button
signOutBtn.addEventListener('click', () => {
    if(clockInBtn.value === "Clock In")
        window.location.href = 'index.html';
    else if(clockInBtn.value === "Clock Out")
        alert('Please clock out before signing out');
});

// Function to format time
function formatTime(hours, minutes, seconds) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to update the display
function updateDisplay(elapsedTime) {
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timeText.innerHTML = `Time Worked: ${formatTime(hours, minutes, seconds)}`;
}

// Function to fetch existing time from database
async function fetchExistingTime() {
    try {
        const response = await fetch(`http://localhost:3000/user/auth/getTime?email=${userEmail}`);
        const data = await response.json();
        if (response.ok) {
            // Convert decimal hours to hours, minutes, seconds
            const totalHours = Math.floor(data.timeWorked);
            const totalMinutes = Math.floor((data.timeWorked % 1) * 60);
            const totalSeconds = Math.floor(((data.timeWorked % 1) * 60 % 1) * 60);
            
            // Update our total time variables
            totalHours = totalHours;
            totalMinutes = totalMinutes;
            totalSeconds = totalSeconds;
            
            // Update display with existing time
            timeText.innerHTML = `Total time worked: ${formatTime(totalHours, totalMinutes, totalSeconds)}`;
        }
    } catch (error) {
        console.error("Error fetching existing time:", error);
    }
}

// Fetch existing time when page loads
fetchExistingTime();

//Clock in
clockInBtn.addEventListener('click', async () => {
    if (clockInBtn.value === "Clock In") {
        startTime = new Date();
        
        // Update the timer display every second
        timerId = setInterval(() => {
            const currentTime = new Date();
            const elapsedTime = currentTime - startTime;
            updateDisplay(elapsedTime);
        }, 1000);

        clockInBtn.value = "Clock Out";
    }
    else {
        // Stop the timer
        clearInterval(timerId);
        const endTime = new Date();
        const sessionTime = endTime - startTime;
        
        // Convert session time to hours, minutes, seconds
        const sessionHours = Math.floor(sessionTime / 3600000);
        const sessionMinutes = Math.floor((sessionTime % 3600000) / 60000);
        const sessionSeconds = Math.floor((sessionTime % 60000) / 1000);
        
        // Add to total time
        totalSeconds += sessionSeconds;
        totalMinutes += sessionMinutes;
        totalHours += sessionHours;

        // Handle overflow
        if (totalSeconds >= 60) {
            totalMinutes += Math.floor(totalSeconds / 60);
            totalSeconds %= 60;
        }
        if (totalMinutes >= 60) {
            totalHours += Math.floor(totalMinutes / 60);
            totalMinutes %= 60;
        }

        // Calculate total time in decimals
        totalTimeInDecimals = totalHours + (totalMinutes / 60) + (totalSeconds / 3600);
        
        // Update display with total time
        timeText.innerHTML = `Total time worked: ${formatTime(totalHours, totalMinutes, totalSeconds)}`;
        
        // Log the time
        logTime(userEmail, totalTimeInDecimals);
        console.log('Clocked Out');
        
        clockInBtn.value = "Clock In";
    }
});

// Function to log time to the server
async function logTime(userEmail, totalTimeInDecimals) {
    console.log("Logging time for:", userEmail, "Time:", totalTimeInDecimals); // Debugging
    try {
        const response = await fetch("http://localhost:3000/user/auth/logTimes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                UserEmail: userEmail,  
                timeWorked: totalTimeInDecimals
            }),
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (response.ok) {
            alert("Logged time successfully!");
        } else {
            alert(data.message || "Failed to log time.");
        }
    } catch (error) {
        console.error("Error logging time:", error);
        alert("An error occurred while logging time. Please try again.");
    }
}

