document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const key = document.getElementById('key').value;
    const password = document.getElementById('password').value;

    if (!key || !password) {
        alert('Please enter both key and password.');
        return;
    }
    if (key === 'admin' && password === 'password') {
        const tx = await isAdmin();

        if (tx) {
            window.location.href = 'admin-dashboard.html';
        }
        else {
            alert("not admin" + tx);
        }
    } else {
        alert('Invalid key or password.');
    }

});
async function isAdmin() {
    const { abi, contractAddress } = await loadContractData();
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const add = signer.getAddress();
        try {
            const tx = await contract.checkAdmin(add);
            console.log(tx);
            return tx;

        } catch (error) {
            console.log(error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}
async function loadContractData() {
    const response = await fetch('AD-contract_sol_EHR.json');
    const abi = await response.json();
    const { contractAddress } = await import('./config.js');

    return { abi, contractAddress };
}