document.addEventListener('DOMContentLoaded', () => {
    
    loadContent('doctor-list.html');
    
    document.getElementById('doctorsList').addEventListener('click', function () {
        setActiveMenu('doctorsList');
        loadContent('doctor-list.html');
    });

    document.getElementById('patientsList').addEventListener('click', function () {
        setActiveMenu('patientsList');
        loadContent('patient-list.html');
    });

    document.getElementById('addDoctor').addEventListener('click', function () {
        setActiveMenu('addDoctor');
        loadContent('add-doctor.html');
    });

    document.getElementById('signOut').addEventListener('click', function () {
        window.location.href = 'admin-login.html'; // Redirect to login page
    });

    function setActiveMenu(activeId) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }

    function loadContent(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
                if (url === 'doctor-list.html') {
                    addDoctorList();
                }
                if (url === 'patient-list.html') {
                    addPatientList();
                }
                if (url === 'add-doctor.html') {
                    addDoctorListen();
                }
            });
    }
});

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
function showLoadingOverlay(message) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.innerText = message;
    loadingOverlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none';
}