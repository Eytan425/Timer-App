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

    // Add error message containers if not present
    let signUpError = document.getElementById('signUpError');
    if (!signUpError) {
        signUpError = document.createElement('div');
        signUpError.id = 'signUpError';
        signUpError.className = 'error-message';
        const signUpForm = document.getElementById('signUpBtn').closest('form');
        signUpForm.insertBefore(signUpError, document.getElementById('signUpBtn'));
    }
    let signInError = document.getElementById('signInError');
    if (!signInError) {
        signInError = document.createElement('div');
        signInError.id = 'signInError';
        signInError.className = 'error-message';
        const signInForm = document.getElementById('signInBtn').closest('form');
        signInForm.insertBefore(signInError, document.getElementById('signInBtn'));
    }
    
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
        signUpError.textContent = '';
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
        signInError.textContent = '';
    });

    async function register() {
        const signUpName = document.getElementById("signUpName").value;
        const signUpEmail = document.getElementById("signUpEmail").value;
        const signUpPassword = document.getElementById("signUpPassword").value;
        signUpError.textContent = '';

        // Validate email
        if (!valid(signUpEmail)) {
            signUpError.textContent = "Please enter a valid email address";
            return;
        }

        // Validate password on client side
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
        if (!passwordRegex.test(signUpPassword)) {
            signUpError.textContent = "Password must be 8-15 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@.#$!%*?&)";
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
                signUpError.textContent = '';
            } else {
                signUpError.textContent = data.message || 'Registration failed.';
            }
        } catch (error) {
            console.error("Error registering user:", error);
            signUpError.textContent = "An error occurred during registration. Please try again.";
        }
    }

    async function signIn() {
        const signInEmail = document.getElementById('signInEmail').value;
        const signInPassword = document.getElementById('signInPassword').value;
        signInError.textContent = '';

        // Validate email
        if (!valid(signInEmail)) {
            signInError.textContent = "Please enter a valid email address";
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
                signInError.textContent = data.message || 'Invalid credentials';
            }
        } catch (error) {
            console.error("Error signing in:", error);
            signInError.textContent = "An error occurred during sign-in. Please try again.";
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
                    signUpError.textContent = "Please fill in all fields.";
                }
            } else if (["signInEmail", "signInPassword"].includes(activeElement.id)) {
                const signInEmail = document.getElementById('signInEmail').value;
                const signInPassword = document.getElementById('signInPassword').value;

                if (signInEmail && signInPassword) {
                    await signIn();
                } else {
                    signInError.textContent = "Please fill in all fields.";
                }
            }
        }
    });

    signUpBtn.addEventListener('click', register);
    signInBtn.addEventListener('click', signIn);

    // Add event listener for password input to update strength bar and requirements
    const signUpPasswordInput = document.getElementById("signUpPassword"); // Get the password input field
    const passwordStrengthFill = document.getElementById("passwordStrengthFill"); // Get the strength bar fill element
    const reqLength = document.getElementById("req-length"); // Get the length requirement element
    const reqUpper = document.getElementById("req-upper"); // Get the uppercase requirement element
    const reqLower = document.getElementById("req-lower"); // Get the lowercase requirement element
    const reqNumber = document.getElementById("req-number"); // Get the number requirement element
    const reqSpecial = document.getElementById("req-special"); // Get the special character requirement element

    // Listen for input changes on the password field
    signUpPasswordInput.addEventListener("input", function () {
        const password = signUpPasswordInput.value; // Get the current password value
        // Check each requirement
        const lengthValid = password.length >= 8 && password.length <= 15; // Check length
        const upperValid = /[A-Z]/.test(password); // Check for uppercase
        const lowerValid = /[a-z]/.test(password); // Check for lowercase
        const numberValid = /\d/.test(password); // Check for number
        const specialValid = /[@.#$!%*?&]/.test(password); // Check for special character

        // Update checklist UI
        reqLength.textContent = (lengthValid ? '✅' : '❌') + ' 8-15 characters'; // Update length
        reqUpper.textContent = (upperValid ? '✅' : '❌') + ' At least one uppercase letter'; // Update uppercase
        reqLower.textContent = (lowerValid ? '✅' : '❌') + ' At least one lowercase letter'; // Update lowercase
        reqNumber.textContent = (numberValid ? '✅' : '❌') + ' At least one number'; // Update number
        reqSpecial.textContent = (specialValid ? '✅' : '❌') + ' At least one special character (@.#$!%*?&)'; // Update special

        // Calculate password strength (simple scoring)
        let score = 0; // Initialize score
        if (lengthValid) score++;
        if (upperValid) score++;
        if (lowerValid) score++;
        if (numberValid) score++;
        if (specialValid) score++;

        // Set strength bar width and color based on score
        const percent = (score / 5) * 100; // Calculate percent
        passwordStrengthFill.style.width = percent + '%'; // Set width
        if (score <= 2) {
            passwordStrengthFill.style.background = 'red'; // Weak
        } else if (score === 3 || score === 4) {
            passwordStrengthFill.style.background = 'orange'; // Medium
        } else {
            passwordStrengthFill.style.background = 'green'; // Strong
        }
    });
});
