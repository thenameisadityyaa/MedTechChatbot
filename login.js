const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const formTitle = document.getElementById("form-title");
const message = document.getElementById("message");

const step1 = document.getElementById("signup-step-1");
const step2 = document.getElementById("signup-step-2");
const step3 = document.getElementById("signup-step-3");

function toggleForm() {
  loginForm.classList.toggle("active");
  signupForm.classList.toggle("active");
  formTitle.textContent = loginForm.classList.contains("active")
    ? "Login to HealthAssist"
    : "Create Your Account";
  message.textContent = "";
  resetSignupSteps();
}

// ---------- LOGIN ----------
async function handleLogin() {
  const id = document.getElementById("login-id").value.trim();
  const pass = document.getElementById("login-password").value;

  if (!id || !pass) {
    message.style.color = "red";
    message.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pass })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      message.style.color = "red";
      message.textContent = data.error || "Login failed.";
    }
  } catch (err) {
    console.error("Login error:", err);
    message.textContent = "Server error.";
  }
}

// ---------- SIGNUP ----------

// Step 1: Send OTP
async function sendSignupOTP() {
  const contact = document.getElementById("signup-contact").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{10}$/;

  if (!emailPattern.test(contact) && !phonePattern.test(contact)) {
    message.style.color = "red";
    message.textContent = "Enter a valid email or 10-digit phone number.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact })
    });
    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.textContent = "OTP sent successfully.";
      step1.classList.remove("active");
      step2.classList.add("active");
    } else {
      message.style.color = "red";
      message.textContent = data.error || "Failed to send OTP.";
    }
  } catch (err) {
    console.error("OTP error:", err);
    message.textContent = "Server error.";
  }
}

// Step 2: Verify OTP
async function verifySignupOTP() {
  const contact = document.getElementById("signup-contact").value.trim();
  const otp = document.getElementById("signup-otp").value.trim();

  if (!otp) {
    message.style.color = "red";
    message.textContent = "Please enter the OTP.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, otp })
    });
    const data = await res.json();

    if (res.ok) {
      message.textContent = "";
      step2.classList.remove("active");
      step3.classList.add("active");
    } else {
      message.style.color = "red";
      message.textContent = data.error || "Invalid OTP.";
    }
  } catch (err) {
    console.error("OTP verify error:", err);
    message.textContent = "Server error.";
  }
}

// Step 3: Complete Signup
async function completeSignup() {
  const contact = document.getElementById("signup-contact").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const pass = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (!username || !pass || !confirm) {
    message.style.color = "red";
    message.textContent = "Please fill in all fields.";
    return;
  }

  if (pass !== confirm) {
    message.style.color = "red";
    message.textContent = "Passwords do not match.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, username, password: pass })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.textContent = "Account created! Please login.";
      resetSignupSteps();
      toggleForm(); // go to login view
    } else {
      message.style.color = "red";
      message.textContent = data.error || "Signup failed.";
    }
  } catch (err) {
    console.error("Signup error:", err);
    message.textContent = "Server error.";
  }
}

// Reset signup UI steps
function resetSignupSteps() {
  step1.classList.add("active");
  step2.classList.remove("active");
  step3.classList.remove("active");
}