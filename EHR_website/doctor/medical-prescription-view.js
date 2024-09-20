
const formData = {
    doctorName: "Dr. John Doe",
    patientName: "Jane Smith",
    patientAge: "45",
    diagnosis: "Hypertension",
    medicines: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once a day", duration: "30 days" },
        { name: "Amlodipine", dosage: "5mg", frequency: "Once a day", duration: "30 days" }
    ],
    attachedFiles: [
        "blood_report.pdf",
        "xray_scan.png"
    ]
};

// Function to populate the form details
function populateDetails() {
    document.getElementById('doctorName').textContent = formData.doctorName;
    document.getElementById('patientName').textContent = formData.patientName;
    document.getElementById('patientAge').textContent = formData.patientAge;
    document.getElementById('diagnosis').textContent = formData.diagnosis;

    // Populate medicine list
    const medicineList = document.getElementById('medicineList').getElementsByTagName('tbody')[0];
    formData.medicines.forEach(medicine => {
        const row = medicineList.insertRow();
        row.insertCell(0).textContent = medicine.name;
        row.insertCell(1).textContent = medicine.dosage;
        row.insertCell(2).textContent = medicine.frequency;
        row.insertCell(3).textContent = medicine.duration;
    });

    // Populate attached files
    const fileList = document.getElementById('fileList');
    formData.attachedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.textContent = file;
        fileList.appendChild(fileItem);
    });
}

// Call the function to populate the form details on page load
window.onload = populateDetails;

// Go back function
function goBack() {
    window.history.back();
}