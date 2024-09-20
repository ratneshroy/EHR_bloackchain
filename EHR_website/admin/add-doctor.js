async function addDoctorListen() {
    const form = document.getElementById('addDoctorForm');
    const statusElement = document.getElementById('status');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        showLoadingOverlay("Adding Doctor please wait..");
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });
        const jsonData = JSON.stringify(data, null, 2);
        const doctorSpeciality = document.getElementById('doctorSpeciality').value;

        const contract = await getContract();
        try {

            const encryptedData = CryptoJS.AES.encrypt(jsonData, '12345678').toString();
            const tx = await contract.addDoctor(uuid.v4(), encryptedData, doctorSpeciality.toString());
            statusElement.innerHTML = 'Transaction sent Wait for mining';
            await tx.wait();
            alert('Doctor added successfully!');
            hideLoadingOverlay();
            statusElement.innerHTML = 'Doctor added successfully!';

            form.reset();
        } catch (error) {
            hideLoadingOverlay();
            alert("error submiting form check log");
            console.log(error);

        }

    });

}
