document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form from submitting normally

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Email validation
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Accept any password for now
        if (password.length < 1) {
            alert("Please enter a password.");
            return;
        }

        // Store user session (temporary, for now)
        sessionStorage.setItem("user", email);

        // Redirect to main.html
        window.location.href = "main.html";
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
