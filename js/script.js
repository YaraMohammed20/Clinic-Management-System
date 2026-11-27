const STORAGE_KEY = "carewell-patients";

const defaultPatients=[
    {
        id: "PT-1024",
        name: "Olivia Martin",
        birthDate: "1994-05-14",
        joinDate: "2024-02-12",
        nextVisit: "2025-07-21",
        nextVisitTime: "08:00",
        visits: 8,
        photo: "https://i.pravatar.cc/150?img=12"
    },

    {
        id: "PT-1024",
        name: "Olivia Martin",
        birthDate: "1994-05-14",
        joinDate: "2024-02-12",
        nextVisit: "2025-07-21",
        nextVisitTime: "08:00",
        visits: 8,
        photo: "https://i.pravatar.cc/150?img=12"
    },

    {
        id: "PT-1026",
        name: "Emma Thompson",
        birthDate: "2001-03-23",
        joinDate: "2025-04-17",
        nextVisit: "2025-07-22",
        nextVisitTime: "08:00",
        visits: 3,
        photo: "https://i.pravatar.cc/150?img=47"
    },

    {
        id: "PT-1027",
        name: "Liam Robinson",
        birthDate: "1976-12-11",
        joinDate: "2022-06-03",
        nextVisit: "2025-07-23",
        nextVisitTime: "08:00",
        visits: 12,
        photo: "https://i.pravatar.cc/150?img=68"
    },

    {
        id: "PT-1028",
        name: "Sophia Patel",
        birthDate: "1990-08-29",
        joinDate: "2024-11-22",
        nextVisit: "2025-07-24",
        nextVisitTime: "08:00",
        visits: 6,
        photo: "https://i.pravatar.cc/150?img=44"
    },

    {
        id: "PT-1029",
        name: "William Scott",
        birthDate: "1965-02-17",
        joinDate: "2021-09-09",
        nextVisit: "2025-07-25",
        nextVisitTime: "08:00",
        visits: 10,
        photo: "https://i.pravatar.cc/150?img=14"
    },
];

function getPatients(){
    const data = localStorage.getItem(STORAGE_KEY);

    if(data){
        return JSON.parse(data);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultPatients)
    );

    return defaultPatients;
}

function savePatients(patients){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(patients)
    );
}

function getPatientById(id){
    return getPatients().find(patient => patient.id === id);
}

function calculateAge(birthDate){
    if (!birthDate) return "";

    const birth = new Date(birthDate + "T00:00:00");
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const monthDifference = today.getMonth() - birth.getMonth();

    if(
        monthDifference <0 ||
        (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }
    
    return age;
}

function formDate(dateString) {

    if (!dateString) return "-";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

const tableBody = document.getElementById("patientsTableBody");

if (tableBody) {

    const searchInput = document.getElementById("searchInput");
    const dateFilter = document.getElementById("dateFilter");
    const patientCount = document.getElementById("patientCount");
    const emptyMessage = document.getElementById("emptyMessage");

    function renderPatients() {

        const patients = getPatients();

        const searchValue = searchInput.value.toLowerCase().trim();
        const selectedYear = dateFilter.value;

        const filteredPatients = patients.filter(patient => {

            const matchesSearch =
                patient.name.toLowerCase().includes(searchValue) ||
                patient.id.toLowerCase().includes(searchValue);

            const matchesYear =
                selectedYear === "all" ||
                patient.joinDate.startsWith(selectedYear);

            return matchesSearch && matchesYear;
        });

        patientCount.textContent = filteredPatients.length;

        tableBody.innerHTML = "";

        filteredPatients.forEach(patient => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="patient-cell">
                        <img
                            src="${patient.photo || "https://i.pravatar.cc/150?img=12"}"
                            alt=""
                        >

                        <div>
                            <span class="patient-name">
                                ${patient.name}
                            </span>

                            <span class="patient-id">
                                #${patient.id}
                            </span>
                        </div>

                    </div>
                </td>

                <td>${formatDate(patient.birthDate)}</td>

                <td>${calculateAge(patient.birthDate)} years</td>

                <td>${formatDate(patient.joinDate)}</td>

                <td>${formatDate(patient.nextVisit)}</td>

                <td>${patient.nextVisitTime || "-"}</td>

                <td>
                    <div class="actions">

                        <a
                            href="edit-patient.html?id=${patient.id}"
                            class="action-link"
                        >
                            View
                        </a>

                        <a
                            href="edit-patient.html?id=${patient.id}"
                            class="action-link"
                        >
                            Edit
                        </a>

                        <button
                            class="action-link delete"
                            data-delete="${patient.id}"
                        >
                            Delete
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        emptyMessage.classList.toggle(
            "hidden",
            filteredPatients.length !== 0
        );

        document.querySelectorAll("[data-delete]").forEach(button => {
            button.addEventListener("click", () => {
                deletePatient(button.dataset.delete);
            });
        });
    }

    searchInput.addEventListener("input", renderPatients);

    dateFilter.addEventListener("change", renderPatients);

    renderPatients();

    function deletePatient(id) {

        const confirmed = confirm(
            "Are you sure you want to delete this patient?"
        );

        if (!confirmed) return;

        const updatedPatients = getPatients().filter(
            patient => patient.id !== id
        );

        savePatients(updatedPatients);

        renderPatients();
    }

    const modal = document.getElementById("addPatientModal");

    const addPatientBtn = document.getElementById("addPatientBtn");

    const closeModal = document.getElementById("closeModal");

    const addPatientForm = document.getElementById("addPatientForm");

    addPatientBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });

    addPatientForm.addEventListener("submit", event => {

        event.preventDefault();

        const formData = new FormData(addPatientForm);

        const patients = getPatients();

        const newId = "PT-" + (
            Math.max(
                1029,
                ...patients.map(patient =>
                    Number(patient.id.replace("PT-", ""))
                )
            ) + 1
        );

        const newPatient = {

            id: newId,

            name: formData.get("name"),

            birthDate: formData.get("birthDate"),

            joinDate: formData.get("joinDate"),

            nextVisit: formData.get("nextVisit") || "",

            nextVisitTime: formData.get("nextVisitTime") || "",

            visits: 0,

            photo: "https://i.pravatar.cc/150?img=12"
        };
        patients.push(newPatient);

        savePatients(patients);

        addPatientForm.reset();

        modal.classList.add("hidden");

        renderPatients();
    });
}

const editForm = document.getElementById("editPatientForm");

if (editForm) {

    const params = new URLSearchParams(window.location.search);

    const patientId = params.get("id");

    let patient = getPatientById(patientId);

    if (!patient) {
        alert("Patient not found.");
        window.location.href = "patients.html";
    }

    if (patient) {

        const editName = document.getElementById("editName");

        const editBirthDate = document.getElementById("editBirthDate");

        const editJoinDate = document.getElementById("editJoinDate");

        const editAge = document.getElementById("editAge");

        const patientPhoto = document.getElementById("patientPhoto");

        editName.value = patient.name;

        editBirthDate.value = patient.birthDate;

        editJoinDate.value = patient.joinDate;

        editAge.value = calculateAge(patient.birthDate) + " years";

        patientPhoto.src = patient.photo;

        document.getElementById("breadcrumbPatientName")
            .textContent = patient.name;

        document.getElementById("patientIdDisplay")
            .textContent = "#" + patient.id;

        document.getElementById("reservationInfo")
            .textContent =
                patient.visits + " visits · Next on " +
                formatDate(patient.nextVisit);

        editBirthDate.addEventListener("change", () => {

            editAge.value = calculateAge(editBirthDate.value) + " years";
        });

        document.getElementById("savePatientBtn")
            .addEventListener("click", () => {

                if (!editForm.reportValidity()) return;

                patient.name = editName.value;

                patient.birthDate = editBirthDate.value;

                patient.joinDate = editJoinDate.value;

                const patients = getPatients();

                const index = patients.findIndex(
                    item => item.id === patient.id
                );

                if (index !== -1) {

                    patients[index] = patient;

                    savePatients(patients);
                }

                alert("Patient information saved successfully!");

                window.location.href = "patients.html";
            });

        document.getElementById("photoInput")
            .addEventListener("change", event => {

                const file = event.target.files[0];

                if (!file) return;


                if (file.size > 5 * 1024 * 1024) {

                    alert("File size must be less than 5 MB.");

                    event.target.value = "";

                    return;
                }
                const reader = new FileReader();
                reader.onload = function () {

                    patient.photo = reader.result;

                    patientPhoto.src = reader.result;
                };
                reader.readAsDataURL(file);
            });

        document.getElementById("deletePatientBtn")
            .addEventListener("click", () => {
                const confirmed = confirm(
                    "Are you sure you want to permanently delete this patient?"
                );

                if (!confirmed) return;

                const patients = getPatients().filter(
                    item => item.id !== patient.id
                );

                savePatients(patients);

                alert("Patient deleted successfully.");

                window.location.href = "patients.html";
            });
    }
}
