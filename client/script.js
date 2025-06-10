// script.js
const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://timer-app-079v.onrender.com';

function setUserEmail(email) {
    localStorage.setItem('userEmail', email);
}

function getUserEmail() {
    return localStorage.getItem('userEmail');
}

function valid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

document.addEventListener('DOMContentLoaded', () => {
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

    async function register() {
        const signUpName = document.getElementById("signUpName").value;
        const signUpEmail = document.getElementById("signUpEmail").value;
        const signUpPassword = document.getElementById("signUpPassword").value;

        // Validate email
        if (!valid(signUpEmail)) {
            alert("Please enter a valid email address");
            return;
        }

        // Validate password on client side
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
        if (!passwordRegex.test(signUpPassword)) {
            alert("Password must be 8-15 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@.#$!%*?&)");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/user/auth/register`, {
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
                container.classList.remove("active");
            } else {
                alert(data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error("Error registering user:", error);
            alert("An error occurred during registration. Please try again.");
        }
    }

    async function signIn() {
        const signInEmail = document.getElementById('signInEmail').value;
        const signInPassword = document.getElementById('signInPassword').value;

        // Validate email
        if (!valid(signInEmail)) {
            alert("Please enter a valid email address");
            return;
        }

        try {
            const response = await fetch(`${baseURL}/user/auth/signIn`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: signInEmail, password: signInPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setUserEmail(signInEmail);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error("Error signing in:", error);
            alert("An error occurred during sign-in. Please try again.");
        }
    }

    document.addEventListener("keydown", async function(event) {
        if (event.key === "Enter") {
            const activeElement = document.activeElement;
            if (["signUpName", "signUpEmail", "signUpPassword"].includes(activeElement.id)) {
                const signUpName = document.getElementById("signUpName").value;
                const signUpEmail = document.getElementById("signUpEmail").value;
                const signUpPassword = document.getElementById("signUpPassword").value;

                if (signUpName && signUpEmail && signUpPassword) {
                    await register();
                } else {
                    alert("Please fill in all fields.");
                }
            } else if (["signInEmail", "signInPassword"].includes(activeElement.id)) {
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

    signUpBtn.addEventListener('click', register);
    signInBtn.addEventListener('click', signIn);
});
