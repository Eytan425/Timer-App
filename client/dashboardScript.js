// dashboardScript.js

const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://timer-app-ka3v.onrender.com';

let totalHours = 0, totalMinutes = 0, totalSeconds = 0;
let timerId; // Store the timer ID
let startTime; // Store the start time
let totalTimeInDecimals;

const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
    window.location.href = 'index.html'; // Redirect to login if no email found
}

document.addEventListener('DOMContentLoaded', () => {
    const signOutBtn = document.getElementById('signOutBtn');
    const clockInBtn = document.getElementById('clockInBtn');
    const timeText = document.getElementById('timeText');
    const userNameEl = document.getElementById('userName');

    // Load and show username if stored
    const signUpName = localStorage.getItem('signUpName');
    userNameEl.textContent = signUpName ? signUpName : 'Guest';

    // Sign out logic
    signOutBtn.addEventListener('click', () => {
        if (clockInBtn.value === "Clock In") {
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
        } else if (clockInBtn.value === "Clock Out") {
            alert('Please clock out before signing out');
        }
    });

    function formatTime(hours, minutes, seconds) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateDisplay(elapsedTime) {
        const hours = Math.floor(elapsedTime / 3600000);
        const minutes = Math.floor((elapsedTime % 3600000) / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        timeText.innerHTML = `Time Worked: ${formatTime(hours, minutes, seconds)}`;
    }

    async function fetchExistingTime() {
        try {
            const response = await fetch(`${baseURL}/user/auth/getTime?email=${userEmail}`);
            const data = await response.json();
            if (response.ok) {
                // Convert decimal hours to h, m, s
                totalHours = Math.floor(data.timeWorked);
                totalMinutes = Math.floor((data.timeWorked % 1) * 60);
                totalSeconds = Math.floor((((data.timeWorked % 1) * 60) % 1) * 60);

                timeText.innerHTML = `Total time worked: ${formatTime(totalHours, totalMinutes, totalSeconds)}`;
            }
        } catch (error) {
            console.error("Error fetching existing time:", error);
        }
    }

    fetchExistingTime();

    clockInBtn.addEventListener('click', () => {
        if (clockInBtn.value === "Clock In") {
            startTime = new Date();

            timerId = setInterval(() => {
                const currentTime = new Date();
                const elapsedTime = currentTime - startTime;
                updateDisplay(elapsedTime);
            }, 1000);

            clockInBtn.value = "Clock Out";
        } else {
            clearInterval(timerId);
            const endTime = new Date();
            const sessionTime = endTime - startTime;

            // Convert session time to h, m, s
            const sessionHours = Math.floor(sessionTime / 3600000);
            const sessionMinutes = Math.floor((sessionTime % 3600000) / 60000);
            const sessionSeconds = Math.floor((sessionTime % 60000) / 1000);

            // Add session time to total time
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

            totalTimeInDecimals = totalHours + (totalMinutes / 60) + (totalSeconds / 3600);

            timeText.innerHTML = `Total time worked: ${formatTime(totalHours, totalMinutes, totalSeconds)}`;

            logTime(userEmail, totalTimeInDecimals);

            clockInBtn.value = "Clock In";
        }
    });

    async function logTime(userEmail, totalTimeInDecimals) {
        try {
            const response = await fetch(`${baseURL}/user/auth/logTimes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserEmail: userEmail,
                    timeWorked: totalTimeInDecimals,
                }),
            });

            const data = await response.json();

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
});
