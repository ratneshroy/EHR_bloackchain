async function addPatientsMedicalRecord() {
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
            <td><button class="veiw-report-button" onclick="openMedicalReport(this)">view report</button></td>
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
function openMedicalReport(button){
    fetch('medical-prescription-view.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;

            

        });
}
addPatientsMedicalRecord();