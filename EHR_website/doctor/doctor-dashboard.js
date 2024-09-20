document.addEventListener('DOMContentLoaded', () => {
    loadContent('doctor-home.html');

    document.getElementById('home').addEventListener('click', function () {
        setActiveMenu('home');
        loadContent('doctor-home.html');
    });

    document.getElementById('viewReports').addEventListener('click', function () {
        setActiveMenu('viewReports');
        loadContent('doctor-view-reports.html');
    });

    document.getElementById('consult').addEventListener('click', function () {
        setActiveMenu('consult');
        loadContent('doctor-consult.html');
    });

    document.getElementById('signOut').addEventListener('click', function () {
        window.location.href = 'doctor-login.html';
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
                if (url === "doctor-home.html") {
                    loadScriptForPage('doctor-home.js');
                }
                if (url === "doctor-consult.html") {
                    addPatients();

                }
                if(url === "doctor-view-reports.html"){
                    loadScriptForPage('doctor-view-reports.js');
                }
            });
    }

});
function loadScriptForPage(scriptSrc) {
    const existingScript = document.getElementById('dynamicScript');
    if (existingScript) {
        existingScript.remove();
    }
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.id = 'dynamicScript';
    document.body.appendChild(script);
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
function showLoadingOverlay(message) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.innerText = message;
    loadingOverlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none';
}
function ecrypt(data) {
    return CryptoJS.AES.encrypt(data, '12345678').toString();
}
function decrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, '12345678');
    return bytes.toString(CryptoJS.enc.Utf8);
}