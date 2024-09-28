// Sidebar Tab Switching and Active State Handling
document.querySelectorAll('.sidebar nav ul li a').forEach(async link => {
    addProfile();
    link.addEventListener('click', function () {
        document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
        this.parentElement.classList.add('active');
        
        // Hide all sections
        document.getElementById('profile-section').style.display = 'none';
        document.getElementById('book-appointment-section').style.display = 'none';
        document.getElementById('your-appointments-section').style.display = 'none';
        document.getElementById('notifications-section').style.display = 'none';
        document.getElementById('view-records-section').style.display = 'none';

        // Show the selected section
        const id = this.id;
        if (id === 'profile-tab') {
            document.getElementById('profile-section').style.display = 'block';
            addProfile();
        } else if (id === 'appointment-tab') {
            document.getElementById('book-appointment-section').style.display = 'block';
        } else if (id === 'appointments-tab') {
            document.getElementById('your-appointments-section').style.display = 'block';
        } else if (id === 'notifications-tab') {
            document.getElementById('notifications-section').style.display = 'block';
        } else if (id === 'medical-records-tab') {
            document.getElementById('view-records-section').style.display = 'block';
        }
    });



});
async function addProfile() {
    const contract = await getContract();
    try {
        const response = await contract.getPatient("wfwf4wf48w4f84");
        const secretKey = '12345678';
        const bytes = CryptoJS.AES.decrypt(response, secretKey);
        const patientDetails = bytes.toString(CryptoJS.enc.Utf8);
        var patient = JSON.parse(patientDetails);
        const profileInfo = document.getElementById('profile-info');
        profileInfo.innerHTML = `
        <p><strong>Name:</strong> ${patient.Name}</p>
        <p><strong>Age:</strong> ${patient.Age}</p>
        <p><strong>Gender:</strong> Male</p>
        <p><strong>Admission Date:</strong> ${patient['Admission Date']}</p>
    `;
    } catch (error) {
        console.log(error);
    }
}
async function loadContractData() {
    const response = await fetch('AD-contract_sol_EHR.json');
    const abi = await response.json();
    const { contractAddress } = await import('./config.js');

    return { abi, contractAddress };
}
async function getContract() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const { abi, contractAddress } = await loadContractData();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        return contract;
    }
    else {
        alert("install metamask");
        return null;
    }
}