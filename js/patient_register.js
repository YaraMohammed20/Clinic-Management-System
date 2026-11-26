
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const birthDate = document.getElementById("birthDate").value;
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        if (!fullName || !birthDate || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (new Date(birthDate) > new Date()) {
            alert("Birth date cannot be in the future.");
            return;
        }

        if (password.length < 8 || !/\d/.test(password)) {
            alert("Password must be at least 8 characters and contain a number.");
            return;
        }

        const patients = JSON.parse(localStorage.getItem("patients")) || [];

        const existingPatient = patients.find(function (patient) {
            return patient.email === email;
        });

        if (existingPatient) {
            alert("This email is already registered. Please login.");
            return;
        }

        const newPatient = {
            fullName: fullName,
            birthDate: birthDate,
            email: email,
            password: password
        };

        patients.push(newPatient);

        localStorage.setItem("patients", JSON.stringify(patients));

        alert("Registration successful! You can now login.");

        window.location.href = "patient_login.html";
    });
});
