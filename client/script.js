export let UserEmail;

function setUserEmail(email) {
    UserEmail = email;
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const signUpBtn = document.getElementById('signUpBtn');
    const signInBtn = document.getElementById('signInBtn');
    const clockInBtn = document.getElementById('clockInBtn');
    const timeText = document.getElementById('timeText'); // Display time summary
    

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // GitHub login function
    

    // Registration function
    async function register() {
        const signUpName = document.getElementById("signUpName").value;
        const signUpEmail = document.getElementById("signUpEmail").value;
        const signUpPassword = document.getElementById("signUpPassword").value;
        
        const saltRounds = 10;

        
        try 
        {
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
                setUserEmail(signInEmail);
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
});

// module.exports = {UserEmail};