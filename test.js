const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
    const provider = new ethers.JsonRpcProvider("HTTP://127.0.0.1:7545");
    const wallet = new ethers.Wallet("0xea6e149e7312cc2b881dd7ee3743fc93f512297f9c59031919460c63c5abb58b", provider);
    const add = "0x446Fd5B73025d9b52F04Ed417F79bd4A1359e7ef";
    const abi = fs.readFileSync("./AD-contract_sol_EHR.abi", "utf8");
    const contract = new ethers.Contract(add,abi,wallet);
   // const tx = await contract.getDoctorList();
   //const p = await contract.addPatient('wfwf4wf48w4f84','U2FsdGVkX197XkF76SVAKInQ1V+9IO7pkZAw/b4FKYu/Ejz7HF/QHW7J4xNWt2Kiu0IlmwoK0KjN1UjNtvRBWY/gR3Imi8w2Ip8PIl8FKCOQE9snJvJAeghM7MDscn+j');
   const o = await contract.addAppointment('123',"wfwf4wf48w4f84",'25660ecb-859f-48a4-9abf-3db6649071ce','U2FsdGVkX197XkF76SVAKInQ1V+9IO7pkZAw/b4FKYu/Ejz7HF/QHW7J4xNWt2Kiu0IlmwoK0KjN1UjNtvRBWY/gR3Imi8w2Ip8PIl8FKCOQE9snJvJAeghM7MDscn+j');
   console.log(o);
}

main();