function addSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function () {
        const searchValue = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#doctorTable tbody tr');

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

async function deleteDoctor(button) {

    if (confirm('Are you sure you want to delete this doctor?')) {
        const row = button.closest('tr');
        const cells = row.getElementsByTagName('td');
        const idx = cells[0].textContent - 1;
        try {
            showLoadingOverlay("Removing Doctor form list \nplease wait");
            const contract = await getContract();
            const doctorList = await contract.getDoctorList();
            const del = await contract.removeDoctor(doctorList[idx]);

            await del.wait();
            hideLoadingOverlay();
            alert('Deleted successfully!');
            row.remove();
        } catch (error) {
            hideLoadingOverlay();
            // alert(error.error.message);
            console.log(error);
        }

    }
}

function viewDoctor(button) {
    const row = button.closest('tr');
    const cells = row.getElementsByTagName('td');

    const doctorName = cells[1].textContent;
    const doctorProfession = cells[2].textContent;
    const doctorJoiningDate = cells[3].textContent;

    document.getElementById('doctorListView').style.display = 'none';
    const detailView = document.getElementById('doctorDetailView');
    detailView.style.display = 'block';

    detailView.innerHTML = `
        <button onclick="goBack()" class="back-button">Back</button>
        <h1>Doctor Details</h1>
        <p><strong>Name:</strong> ${doctorName}</p>
        <p><strong>Profession:</strong> ${doctorProfession}</p>
        <p><strong>Joining Date:</strong> ${doctorJoiningDate}</p>
    `;
}


function goBack() {
    document.getElementById('doctorDetailView').style.display = 'none';
    document.getElementById('doctorListView').style.display = 'block';
}


async function addDoctorList() {
    showLoadingOverlay("Getting Doctor List ..");
    const table = document.getElementById('doctorTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    const contract = await getContract();
    try {
        const doctorList = await contract.getDoctorList();

        doctorList.forEach(async (element, index) => {
            const response = await contract.getDoctor(element);
            const secretKey = '12345678';
            const bytes = CryptoJS.AES.decrypt(response[0], secretKey);
            const doctorDetail = bytes.toString(CryptoJS.enc.Utf8);
            const doctorDetailJSON = JSON.parse(doctorDetail);
            const newRow = table.insertRow();


            newRow.insertCell(0).innerHTML = index + 1;
            newRow.insertCell(1).innerHTML = doctorDetailJSON.doctorName;
            newRow.insertCell(2).innerHTML = doctorDetailJSON.doctorSpeciality;
            newRow.insertCell(3).innerHTML = doctorDetailJSON.doctorDOJ;
            newRow.insertCell(4).innerHTML = `
                <button class="view-button" onclick="viewDoctor(this)">View</button>
                <button class="delete-button" onclick="deleteDoctor(this)">Delete</button>
            `;
        });


        addSearchFunctionality();

    } catch (error) {
        console.error("Error loading doctors: ", error);
    }
    hideLoadingOverlay();
}
