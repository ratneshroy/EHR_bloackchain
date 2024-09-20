function addPatientSearchFunctionality() {
    const searchInput = document.getElementById('patientSearchInput');

    searchInput.addEventListener('input', function () {
        const searchValue = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#patientTable tbody tr'); // Fetch rows dynamically

        rows.forEach(row => {
            const cells = row.getElementsByTagName('td');
            const textContent = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');

            if (textContent.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

async function deletePatient(button) {
    // Confirm before deleting
    if (confirm('Are you sure you want to delete this patient?')) {
        const row = button.closest('tr');
        const cells = row.getElementsByTagName('td');
        const idx = cells[0].textContent - 1;
        try {
            showLoadingOverlay("Removing patient from data ..");
            const contract = await getContract();
            const doctorList = await contract.getPatientList();

            const del = await contract.removePatient(doctorList[idx]);
            await del.wait();
            alert('Deleted successfully!');
            hideLoadingOverlay();
            row.remove();
        }
        catch (error) {
            alert(error.error.message);
        }


    }
}

function viewPatient(button) {
    const row = button.closest('tr');
    const cells = row.getElementsByTagName('td');

    const patientId = cells[1].textContent;
    const patientName = cells[2].textContent;
    const patientAge = cells[3].textContent;
    const patientAdmissionDate = cells[4].textContent;

    document.getElementById('patientListView').style.display = 'none';
    const detailView = document.getElementById('patientDetailView');
    detailView.style.display = 'block';

    detailView.innerHTML = `
        <button onclick="goBackToPatientList()" class="back-button">Back</button>
        <h1>Patient Details</h1>
        <p><strong>Name:</strong> ${patientName}</p>
        <p><strong>Age:</strong> ${patientAge}</p>
        <p><strong>Admission Date:</strong> ${patientAdmissionDate}</p>
    `;
}
async function addPatientList() {
    showLoadingOverlay('Getting patient list ..');
    const table = document.getElementById('patientTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    const contract = await getContract();
    try {
        const patientList = await contract.getPatientList();

        patientList.forEach(async (element, index) => {
            const response = await contract.getPatient(element);
            const secretKey = '12345678';
            const bytes = CryptoJS.AES.decrypt(response, secretKey);
            const patientDetails = bytes.toString(CryptoJS.enc.Utf8);
            const patient = JSON.parse(patientDetails);
            const newRow = table.insertRow();

            newRow.insertCell(0).innerHTML = index + 1;
            newRow.insertCell(1).innerHTML = patient.Name;
            newRow.insertCell(2).innerHTML = patient.Age;
            newRow.insertCell(3).innerHTML = patient["Admission Date"];
            newRow.insertCell(4).innerHTML = `
                <button class="view-button" onclick="viewPatient(this)">View</button>
                <button class="delete-button" onclick="deletePatient(this)">Delete</button>
            `;
        });

        hideLoadingOverlay();
        addPatientSearchFunctionality();
    } catch (error) {
        hideLoadingOverlay();
        console.error("Error loading doctors: ", error);
    }
}


function goBackToPatientList() {
    document.getElementById('patientDetailView').style.display = 'none';
    document.getElementById('patientListView').style.display = 'block';
}
