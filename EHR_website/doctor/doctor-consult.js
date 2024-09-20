// Function to add patients to the table
async function addPatients() {
    const tableBody = document.querySelector('#patientTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    const contract = await getContract();
    try {
        const appointments = await contract.getDoctorAppointments('c9aaaa6f-30ab-44cf-bb0a-d69c9bfd523f');
        const response = appointments[0][3];
        const secretKey = '12345678';

        const bytes = CryptoJS.AES.decrypt(response, secretKey);
        const patientDetails = bytes.toString(CryptoJS.enc.Utf8);
        const patient = JSON.parse(patientDetails);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${1}</td>
            <td>${patient.Name}</td>
            <td>${patient.Age}</td>
            <td><button class="consult-button" onclick="openConsultationForm(this)">Consult</button></td>
        `;
        tableBody.appendChild(row);
    } catch (error) {

    }
    // patients.forEach((patient, index) => {
    //     const row = document.createElement('tr');
    //     row.innerHTML = `
    //         <td>${index + 1}</td>
    //         <td>${patient.name}</td>
    //         <td>${patient.age}</td>
    //         <td><button class="consult-button" onclick="openConsultationForm(this)">Consult</button></td>
    //     `;
    //     tableBody.appendChild(row);
    // });
}
function openConsultationForm(button) {
    // Get the row containing the button clicked
    const row = button.closest('tr');

    // Extract patient data from the row
    const patientName = row.cells[1].innerText;
    const patientAge = row.cells[2].innerText;

    // Load the prescription form
    fetch('medical-prescription.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;

            loadPrescriptionScripts(patientName, patientAge);

        });
}
function loadPrescriptionScripts(patientName, patientAge) {
    const script = document.createElement('script');
    script.src = 'medical-prescription.js';
    script.onload = () => initializePrescriptionForm(patientName, patientAge);
    document.body.appendChild(script);
}
