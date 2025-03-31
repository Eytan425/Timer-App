let totalTimeInDecimals;
let timerId; // Store the timer ID
let seconds = 0, minutes = 0, hours = 0; // Initialize counters
let totalSeconds = 0, totalMinutes = 0, totalHours = 0;
import { UserEmail} from "./script.js";

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

//Clock in
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
            
            // Update the timer display in real-time
            timeText.innerHTML = `Time Worked: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);

        clockInBtn.value = "Clock Out";
    }
    else
    {
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
        logTime(UserEmail, totalTimeInDecimals);
        console.log('Clocked Out');
        seconds = 0;
        minutes = 0;
        hours = 0; // Reset session counters
        clockInBtn.value = "Clock In";
        
    }
});

// Function to log time to the server
async function logTime(userEmail, totalTimeInDecimals) {
    console.log("Logging time for:", userEmail, "Time:", totalTimeInDecimals); // Debugging

    try {
        const response = await fetch("http://localhost:3000/auth/logTimes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                UserEmail: userEmail,  // Ensure UserEmail is sent
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

