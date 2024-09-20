const ethers = require("ethers");
const fs = require("fs-extra");


async function main() {
    try {
        const provider = new ethers.JsonRpcProvider("HTTP://127.0.0.1:7545");
        const wallet = new ethers.Wallet("0xea6e149e7312cc2b881dd7ee3743fc93f512297f9c59031919460c63c5abb58b", provider);
        const abi = fs.readFileSync("./AD-contract_sol_EHR.abi", "utf8");
        const bin = fs.readFileSync("./AD-contract_sol_EHR.bin", "utf8");


        const contractFactory = new ethers.ContractFactory(abi, bin, wallet);


        const contract = await contractFactory.deploy();

        console.log("Contract deployed at address:", await contract.getAddress());
        console.log();

    } catch (error) {
        console.error("Error deploying contract:", error);
    }
}
main();
