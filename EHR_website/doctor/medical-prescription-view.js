var medicineListData ;
async function populateDetails() {
    try {
        const contract = await getContract();
        const reportList = await contract.getMedicalRecords('wfwf4wf48w4f84');
        const data = decrypt(reportList[1][0]);
        const jsonData = JSON.parse(data);
        medicineListData = JSON.parse(jsonData.medicines);
        const fileListData = JSON.parse(jsonData.attachedFile);

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

        // Populate attached files with view and download buttons
        const fileList = document.getElementById('fileList');
        fileListData.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.textContent = file.fileName;
            // Create a view button
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.onclick = async () => {
                const fileBlob = await getFileFromIpfs(file.fileIPFS);
                if (fileBlob) {
                    const fileURL = URL.createObjectURL(fileBlob);
                    window.open(fileURL, file.name);
                }
            };
            
            // Create a download button
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.onclick = async () => {
                const fileBlob = await getFileFromIpfs(file.fileIPFS);
                if (fileBlob) {
                    const fileURL = URL.createObjectURL(fileBlob);
                    const a = document.createElement('a');
                    a.href = fileURL;
                    a.download = file.fileName;  // Set the filename
                    a.click();
                }
            };

            fileItem.appendChild(viewButton);
            fileItem.appendChild(downloadButton);
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
function generatePrescriptionPDF() {
    const jsPDFScript = document.createElement('script');
    jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js';
    jsPDFScript.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const doctorName = document.getElementById('doctorName').innerText;
        const patientName = document.getElementById('patientName').innerText;
        const patientAge = document.getElementById('patientAge').innerText;
        doc.text('Medical Prescription', 10, 10);
        doc.text(`Doctor Name:${doctorName}`,10,20);
        doc.text(`Patient Name: ${patientName}`, 10, 30);
        doc.text(`Patient Age: ${patientAge}`, 10, 40);
        doc.text('Medicines:', 10, 50);

        let yOffset = 60;
        medicineListData.forEach(medicine => {
            const name = medicine.name;
            const dosage = medicine.dosage;
            const frequency = medicine.frequency;
            const duration = medicine.duration;
            doc.text(`Name: ${name}, Dosage: ${dosage}, Frequency: ${frequency}, Duration: ${duration}`, 10, yOffset);
            yOffset += 10;
        });

        doc.save('prescription.pdf');
    };
    document.body.appendChild(jsPDFScript);
}
async function getFileFromIpfs(ipfsHash) {
    const url = `https://harlequin-key-lizard-175.mypinata.cloud/ipfs/${ipfsHash}`; // Replace with your custom gateway
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.blob(); // Get the file as a blob
            return data; // Process or download the file here
        } else {
            console.error('Fetch failed:', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

