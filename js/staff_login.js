
document.addEventListener("DOMContentLoaded", function () {
    const staffLoginForm = document.getElementById("staffLoginForm");
    const forgotPassword = document.getElementById("forgotPassword");

    if (staffLoginForm) {
        staffLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            alert(
                "Your information is valid. Staff login will be available once the backend is connected."
            );
        });
    }

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();

            if (!email) {
                alert("Please enter your email address first.");
                return;
            }

            alert("Password reset will be available once the backend is connected.");
        });
    }
});
