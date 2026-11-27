const clinicName = document.getElementById("clinicName");
const clinicDescription = document.getElementById("clinicDescription");

const logoInput = document.getElementById("logoInput");
const logoPreview = document.getElementById("logoPreview");

const saveBtn = document.getElementById("saveBtn");
const discardBtn = document.getElementById("discardBtn");
const statusMessage = document.getElementById("statusMessage");

const openTimes = document.querySelectorAll(".open-time");
const closeTimes = document.querySelectorAll(".close-time");

const sundayOpen = document.querySelector(".sunday-open");
const sundayClose = document.querySelector(".sunday-close");

const defaultData = {
    clinicName: "Carewell Clinic",
    description: "A welcoming space for better health.",
    logo: "",
    workingHours: [
        { open: "08:00", close: "18:00" },
        { open: "08:00", close: "18:00" },
        { open: "08:00", close: "18:00" },
        { open: "08:00", close: "18:00" },
        { open: "08:00", close: "18:00" },
        { open: "09:00", close: "13:00" },
        { open: "Closed", close: "" }
    ]
};

function updateSundayHours() {
    if (sundayOpen.value === "Closed") {
        sundayClose.value = "";
        sundayClose.disabled = true;
    } else {
        sundayClose.disabled = false;
    }

}

sundayOpen.addEventListener("change", updateSundayHours);

let uploadedLogo = "";

logoInput.addEventListener("change", function () {
    const file = logoInput.files[0];
    if (!file) return;
    if (!["image/png", "image/svg+xml"].includes(file.type)) {
        alert("Please upload a PNG or SVG image.");
        logoInput.value = "";
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert("Image size must not exceed 5 MB.");
        logoInput.value = "";
        return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
        uploadedLogo = event.target.result;
        logoPreview.innerHTML = `
            <img src="${uploadedLogo}" alt="Clinic Logo">
        `;
        statusMessage.textContent = "";
    };

    reader.readAsDataURL(file);

});



function getClinicData() {
    const workingHours = [];
    for (let i = 0; i < openTimes.length; i++) {
        workingHours.push({
            open: openTimes[i].value,
            close: closeTimes[i].value
        });

    }
    return {
        clinicName: clinicName.value,
        description: clinicDescription.value,
        logo: uploadedLogo,
        workingHours: workingHours
    };

}


function displayClinicData(data) {
    clinicName.value = data.clinicName;
    clinicDescription.value = data.description;
    uploadedLogo = data.logo || "";
    if (uploadedLogo) {
        logoPreview.innerHTML = `
            <img src="${uploadedLogo}" alt="Clinic Logo">
        `;

    } else {
        logoPreview.innerHTML = "<span>+</span>";

    }
    data.workingHours.forEach((day, index) => {
        openTimes[index].value = day.open;
        closeTimes[index].value = day.close;

    });
    updateSundayHours();

}


let savedData;
function saveChanges() {
    const data = getClinicData();
    if (!data.clinicName.trim()) {
        alert("Please enter a clinic name.");
        clinicName.focus();
        return;
    }
    localStorage.setItem(
        "clinicInformation",
        JSON.stringify(data)
    );
    savedData = JSON.parse(JSON.stringify(data));
    statusMessage.textContent = "Changes saved successfully!";

}


function discardChanges() {
    if (!confirm("Are you sure you want to discard your changes?")) {
        return;
    }
    displayClinicData(savedData);
    statusMessage.textContent = "Changes discarded.";
    logoInput.value = "";

}



saveBtn.addEventListener("click", saveChanges);
discardBtn.addEventListener("click", discardChanges);



function initializePage() {
    const storedData = localStorage.getItem("clinicInformation");
    if (storedData) {
        try {
            savedData = JSON.parse(storedData);
        } catch (error) {
            savedData = defaultData;
        }
    } else {
        savedData = defaultData;
    }

    displayClinicData(savedData);
}
initializePage();
