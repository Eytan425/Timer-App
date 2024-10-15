const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

async function registerUser() {
  const signUpEmail = document.getElementById("signUpEmail").value;
  const signUpPassword = document.getElementById("signUpPassword").value;

  // Check if passwords match
  if (signUpPassword !== document.getElementById("signUpPasswordAgain").value) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // Send a POST request to the backend
    const response = await fetch("http://localhost:3000/user/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`User registered successfully: ${data.user.email}`);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error registering user:", error);
    alert("An error occurred during registration. Please try again.");
  }
}