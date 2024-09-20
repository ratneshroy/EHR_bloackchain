async function populateDetails() {
    try {
        const contract = await getContract();
        const reportList = await contract.getMedicalRecords('4848e444ce4e4f');
        const data= decrypt(reportList[0][0]);
        const jsonData = JSON.parse(data);
        const medicineListData = JSON.parse(jsonData.medicines);
        const fileListData = JSON.parse(jsonData.attachedFile);console.log(fileListData);
        document.getElementById('doctorName').textContent = jsonData.doctorName;
        document.getElementById('patientName').textContent = jsonData.patientName;
        document.getElementById('patientAge').textContent = jsonData.patientAge;
        document.getElementById('diagnosis').textContent = jsonData.diagnosis;
    
        // Populate medicine list
        const medicineList = document.getElementById('medicineList').getElementsByTagName('tbody')[0];
        medicineListData.forEach(medicine => {
            const row = medicineList.insertRow();
            row.insertCell(0).textContent = medicine.name;
            row.insertCell(1).textContent = medicine.dosage;
            row.insertCell(2).textContent = medicine.frequency;
            row.insertCell(3).textContent = medicine.duration;
        });
    
        // Populate attached files
        const fileList = document.getElementById('fileList');
        fileListData.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.textContent = file.fileName;
            fileList.appendChild(fileItem);
        });
        
    } catch (error) {
        console.log(error);
    }
    


}

// Call the function to populate the form details on page load
// window.onload = populateDetails;

// // Go back function
// function goBack() {
//     window.history.back();
// }