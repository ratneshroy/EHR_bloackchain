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