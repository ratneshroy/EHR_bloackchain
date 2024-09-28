const patientId = 'wfwf4wf48w4f84';
function initializePrescriptionForm(patientName, patientAge) {
    document.getElementById('patientName').value = patientName;
    document.getElementById('patientAge').value = patientAge;
}

function addMedicineField() {
    const medicineFields = document.getElementById('medicineFields');
    const newField = document.createElement('div');
    newField.className = 'medicine-group';
    newField.innerHTML = `
        <input type="text" placeholder="Medicine Name" class="medicine-name">
        <input type="text" placeholder="Dosage" class="medicine-dosage">
        <input type="text" placeholder="Frequency" class="medicine-frequency">
        <input type="text" placeholder="Duration" class="medicine-duration">
        <button type="button" class="remove-row-btn" onclick="removeRow(this)">&times;</button>
    `;
    medicineFields.appendChild(newField);
}
const fileUploadBox = document.getElementById('fileUploadBox');
const fileInput = document.getElementById('fileInput');
const filesList = [];

// Function to trigger file input when add file button is clicked
function triggerFileInput() {
    fileInput.click();
}

// Function to handle the file input change event and display file names
fileInput.addEventListener('change', function (event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        addFile(files[i]);
    }
    // Reset file input so same file can be added again
    fileInput.value = '';
});

// Function to add file to the file list and display it
function addFile(file) {
    const fileItem = document.createElement('div');
    fileItem.classList.add('file-item');
    fileItem.innerHTML = `
                <span>${file.name}</span>
                <button type="button" onclick="removeFile('${file.name}')">&times;</button>
            `;
    fileUploadBox.insertBefore(fileItem, fileUploadBox.querySelector('.add-file-btn'));
    filesList.push(file);
}

// Function to remove file from the list
function removeFile(fileName) {
    const index = filesList.findIndex(file => file.name === fileName);
    if (index !== -1) {
        filesList.splice(index, 1);
        const fileItems = fileUploadBox.querySelectorAll('.file-item');
        fileItems[index].remove();
    }
}
function removeRow(button) {
    const row = button.parentNode;
    row.remove();
}
async function uploadForm() {
    const form = document.getElementById('prescriptionForm');
    const formData = new FormData(form); // Collects the form data except dynamic medicines
    const medicines = [];

    // Loop through each dynamic medicine field and add it to an array
    document.querySelectorAll('.medicine-group').forEach(group => {
        const name = group.querySelector('.medicine-name').value;
        const dosage = group.querySelector('.medicine-dosage').value;
        const frequency = group.querySelector('.medicine-frequency').value;
        const duration = group.querySelector('.medicine-duration').value;

        if (name && dosage && frequency && duration) {
            medicines.push({ name, dosage, frequency, duration });
        }
    });

    // Add medicines to FormData as a JSON string
    formData.append('medicines', JSON.stringify(medicines));
    const attachedFile = [];
    for await (const file of filesList) {
        attachedFile.push({
            fileName: file.name,
            fileIPFS: await uploadToIpfs(file,file.name)
        });
        
    }
    formData.append('attachedFile', JSON.stringify(attachedFile));
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });
    const jsonData = JSON.stringify(data, null, 2);
    const encryptedData = CryptoJS.AES.encrypt(jsonData, '12345678').toString();
    try {
        showLoadingOverlay('uploading');
        const contract = await getContract();
        const response = await contract.addMedicalRecord(patientId,encryptedData);
        await response.wait();
        hideLoadingOverlay();
        form.reset();
    } catch (error) {
        console.log(error);
        hideLoadingOverlay();
    }



}

async function uploadToIpfs(file, name) {
    const PINATA_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNmQ4YWI2OS1lMjE4LTQ0M2QtOTQ0MC01ZGY5NjRjMWJhZWIiLCJlbWFpbCI6Im9ubHltaWNybzI2MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDMxOWQyMDE5MTQ2NDUxZTI3ZmQiLCJzY29wZWRLZXlTZWNyZXQiOiI5MjUwYmRlYzI5MTg3ZWFiYjcxZmJiZTU5MjljMGZmOTRmMjZiZjE3MjA1MWJjZTUxNjA3ODY0YjhlZDM4NWM5IiwiZXhwIjoxNzU4MjA4MzQ2fQ.FE8Sxpip1sasnMyYkgfNF6NJ1xKIauJQnGwizPouAL8';
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();
    formData.append('file', file, name);


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PINATA_JWT_TOKEN}`
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log('File uploaded successfully:', data);
            return data.IpfsHash;
        } else {
            console.error('Upload failed:', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function decrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, '12345678');
    return bytes.toString(CryptoJS.enc.Utf8);
}
