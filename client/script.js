const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const clockInBtn = document.getElementById('clockInBtn');

const isSignedIn = false;

registerBtn.addEventListener('click', () => {
  container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
  container.classList.remove("active");
});
clockInBtn.addEventListener('click', ()=>{
  if(clockInBtn.value == "Clock In"){
    clockInBtn.value = "Clock Out";
  }
  else{
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

async function signIn(isSignedIn) {
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
      isSignedIn == true;
      return isSignedIn;
      
      
    } else {
      alert(data.message || 'Invalid credentials'); // Show error message from backend
    }

  } catch (error) {
    console.error("Error signing in:", error);
    alert("An error occurred during sign-in. Please try again.\n" + error.message);
  }
}


// Attach the event listener to the signUpButton
signUpBtn.addEventListener('click', register);
signInBtn.addEventListener('click', signIn);
