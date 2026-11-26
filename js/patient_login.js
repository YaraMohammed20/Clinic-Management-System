
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("patientLoginForm");
    const forgotPassword = document.getElementById("forgotPassword");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            const patients = JSON.parse(localStorage.getItem("patients")) || [];

            const patient = patients.find(function (patient) {
                return patient.email === email;
            });

            if (!patient) {
                alert("Account not found. Please register first.");
                return;
            }

            if (patient.password !== password) {
                alert("Incorrect password. Please try again.");
                return;
            }

            localStorage.setItem("loggedInPatient", JSON.stringify({
                fullName: patient.fullName,
                email: patient.email
            }));

            alert("Welcome back, " + patient.fullName + "!");

            // Change this to your patient dashboard page
            // window.location.href = "patient_dashboard.html";
        });
    }

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();

            if (!email) {
                alert("Please enter your email address first.");
                return;
            }

            const patients = JSON.parse(localStorage.getItem("patients")) || [];

            const patient = patients.find(function (patient) {
                return patient.email === email;
            });

            if (!patient) {
                alert("No account found with this email. Please register first.");
                return;
            }

            alert("Please contact the clinic to reset your password.");
        });
    }
});
