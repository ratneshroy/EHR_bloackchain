const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
    const provider = new ethers.JsonRpcProvider("HTTP://127.0.0.1:7545");
    const wallet = new ethers.Wallet("0xea6e149e7312cc2b881dd7ee3743fc93f512297f9c59031919460c63c5abb58b", provider);
    const add = "0x93F8223Ac44d132355312789762441fe752Eb51d";
    const abi = fs.readFileSync("./AD-contract_sol_EHR.abi", "utf8");
    const contract = new ethers.Contract(add,abi,wallet);
    //const tx = await contract.getDoctorList();
   //const p = await contract.addPatient('','U2FsdGVkX197XkF76SVAKInQ1V+9IO7pkZAw/b4FKYu/Ejz7HF/QHW7J4xNWt2Kiu0IlmwoK0KjN1UjNtvRBWY/gR3Imi8w2Ip8PIl8FKCOQE9snJvJAeghM7MDscn+j');
   const o = await contract.addAppointment('123',"4848e444ce4e4f",'c9aaaa6f-30ab-44cf-bb0a-d69c9bfd523f','U2FsdGVkX197XkF76SVAKInQ1V+9IO7pkZAw/b4FKYu/Ejz7HF/QHW7J4xNWt2Kiu0IlmwoK0KjN1UjNtvRBWY/gR3Imi8w2Ip8PIl8FKCOQE9snJvJAeghM7MDscn+j');
   console.log(o);
}

main();