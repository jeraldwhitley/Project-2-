document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            // Send login data to the backend
            await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }), // Send login details
            });

            // Redirect to main.html after sending data
            window.location.href = "main.html";
        } catch (error) {
            console.error("Error sending login data:", error);
            alert("An error occurred. Please try again.");
        }
    });
});

