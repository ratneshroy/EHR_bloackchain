// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
pragma experimental ABIEncoderV2;

contract Record {
    struct Patients {
        string ic;
        string name;
        string phone;
        string gender;
        string dob;
        string height;
        string weight;
        string houseaddr;
        string bloodgroup;
        string allergies;
        string medication;
        string emergencyName;
        string emergencyContact;
        address addr;
        uint date;
    }

    struct Doctors {
        string ic;
        string name;
        string phone;
        string gender;
        string dob;
        string qualification;
        string major;
        address addr;
        uint date;
    }

    struct Appointments {
        address doctoraddr;
        address patientaddr;
        string date;
        string time;
        string prescription;
        string description;
        string diagnosis;
        string status;
        uint creationDate;
    }

    struct PatientDetails {
        string ic;
        string name;
        string phone;
        string gender;
        string dob;
        string height;
        string weight;
        string houseaddr;
        string bloodgroup;
        string allergies;
        string medication;
        string emergencyName;
        string emergencyContact;
    }

    struct AppointmentDetails {
        string date;
        string time;
        string diagnosis;
        string prescription;
        string description;
        string status;
    }

    address public owner;
    address[] public patientList;
    address[] public doctorList;
    address[] public appointmentList;

    mapping(address => Patients) patients;
    mapping(address => Doctors) doctors;
    mapping(address => Appointments) appointments;

    mapping(address => mapping(address => bool)) isApproved;
    mapping(address => bool) isPatient;
    mapping(address => bool) isDoctor;
    mapping(address => uint) AppointmentPerPatient;

    uint256 public patientCount = 0;
    uint256 public doctorCount = 0;
    uint256 public appointmentCount = 0;
    uint256 public permissionGrantedCount = 0;

    // Corrected constructor syntax
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not an admin");
        _;
    }

    function getSender() public view returns (address) {
        return msg.sender;
    }

    // Store patient details into the blockchain
    function setDetails(PatientDetails memory details) public {
        require(!isPatient[msg.sender], "Already registered as patient");
        Patients storage p = patients[msg.sender];

        p.ic = details.ic;
        p.name = details.name;
        p.phone = details.phone;
        p.gender = details.gender;
        p.dob = details.dob;
        p.height = details.height;
        p.weight = details.weight;
        p.houseaddr = details.houseaddr;
        p.bloodgroup = details.bloodgroup;
        p.allergies = details.allergies;
        p.medication = details.medication;
        p.emergencyName = details.emergencyName;
        p.emergencyContact = details.emergencyContact;
        p.addr = msg.sender;
        p.date = block.timestamp;

        patientList.push(msg.sender);
        isPatient[msg.sender] = true;
        isApproved[msg.sender][msg.sender] = true;
        patientCount++;
    }

    function getPatientDetails(address _address) public view returns (PatientDetails memory) {
        require(isPatient[_address], "Address is not a registered patient");
        Patients storage p = patients[_address];

        return PatientDetails({
            ic: p.ic,
            name: p.name,
            phone: p.phone,
            gender: p.gender,
            dob: p.dob,
            height: p.height,
            weight: p.weight,
            houseaddr: p.houseaddr,
            bloodgroup: p.bloodgroup,
            allergies: p.allergies,
            medication: p.medication,
            emergencyName: p.emergencyName,
            emergencyContact: p.emergencyContact
        });
    }

    // Allows patient to edit their existing record
    function editDetails(PatientDetails memory details) public {
        require(isPatient[msg.sender], "Not registered as patient");
        Patients storage p = patients[msg.sender];

        p.ic = details.ic;
        p.name = details.name;
        p.phone = details.phone;
        p.gender = details.gender;
        p.dob = details.dob;
        p.height = details.height;
        p.weight = details.weight;
        p.houseaddr = details.houseaddr;
        p.bloodgroup = details.bloodgroup;
        p.allergies = details.allergies;
        p.medication = details.medication;
        p.emergencyName = details.emergencyName;
        p.emergencyContact = details.emergencyContact;
        p.addr = msg.sender;
    }

    // Store doctor details into the blockchain
    function setDoctor(
        string memory _ic,
        string memory _name,
        string memory _phone,
        string memory _gender,
        string memory _dob,
        string memory _qualification,
        string memory _major
    ) public {
        require(!isDoctor[msg.sender], "Already registered as doctor");
        Doctors storage d = doctors[msg.sender];

        d.ic = _ic;
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.dob = _dob;
        d.qualification = _qualification;
        d.major = _major;
        d.addr = msg.sender;
        d.date = block.timestamp;

        doctorList.push(msg.sender);
        isDoctor[msg.sender] = true;
        doctorCount++;
    }

    function getDoctorDetails(address _address) public view returns (Doctors memory) {
        require(isDoctor[_address], "Address is not a registered doctor");
        return doctors[_address];
    }

    // Allows doctors to edit their existing profile
    function editDoctor(
        string memory _ic,
        string memory _name,
        string memory _phone,
        string memory _gender,
        string memory _dob,
        string memory _qualification,
        string memory _major
    ) public {
        require(isDoctor[msg.sender], "Not registered as doctor");
        Doctors storage d = doctors[msg.sender];

        d.ic = _ic;
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.dob = _dob;
        d.qualification = _qualification;
        d.major = _major;
        d.addr = msg.sender;
    }

    // Store appointment details into the blockchain
    function setAppointment(
        address _addr,
        AppointmentDetails memory details
    ) public {
        require(isDoctor[msg.sender], "Only doctors can set appointments");
        Appointments storage a = appointments[_addr];

        a.doctoraddr = msg.sender;
        a.patientaddr = _addr;
        a.date = details.date;
        a.time = details.time;
        a.diagnosis = details.diagnosis;
        a.prescription = details.prescription;
        a.description = details.description;
        a.status = details.status;
        a.creationDate = block.timestamp;

        appointmentList.push(_addr);
        appointmentCount++;
        AppointmentPerPatient[_addr]++;
    }

    // Update existing appointment details
    function updateAppointment(
        address _addr,
        AppointmentDetails memory details
    ) public {
        require(isDoctor[msg.sender], "Only doctors can update appointments");
        Appointments storage a = appointments[_addr];

        a.date = details.date;
        a.time = details.time;
        a.diagnosis = details.diagnosis;
        a.prescription = details.prescription;
        a.description = details.description;
        a.status = details.status;
    }

    // Give permission to doctors to view records
    function givePermission(address _address) public returns (bool success) {
        isApproved[msg.sender][_address] = true;
        permissionGrantedCount++;
        return true;
    }

    // Revoke permission from doctors to view records
    function revokePermission(address _address) public returns (bool success) {
        isApproved[msg.sender][_address] = false;
        return true;
    }

    // Retrieve patient count
    function getPatientCount() public view returns (uint256) {
        return patientCount;
    }

    // Retrieve doctor count
    function getDoctorCount() public view returns (uint256) {
        return doctorCount;
    }

    // Retrieve appointment count
    function getAppointmentCount() public view returns (uint256) {
        return appointmentCount;
    }

    // Retrieve permission granted count
    function getPermissionGrantedCount() public view returns (uint256) {
        return permissionGrantedCount;
    }

    // Retrieve number of appointments for a specific patient
    function getAppointmentPerPatient(address _address) public view returns (uint256) {
        return AppointmentPerPatient[_address];
    }

    // Retrieve list of all patients
    function getPatientList() public view returns (address[] memory) {
        return patientList;
    }

    // Retrieve list of all doctors
    function getDoctorList() public view returns (address[] memory) {
        return doctorList;
    }

    // Check if the sender is the admin
    function isAdmin() public view returns (bool) {
        return msg.sender == owner;
    }

    // Delete doctor
    function deleteDoctor(address _address) public onlyOwner {
        require(isDoctor[_address], "Address is not a registered doctor");
        delete doctors[_address];
        isDoctor[_address] = false;
        doctorCount--;

        // Remove from doctorList
        for (uint256 i = 0; i < doctorList.length; i++) {
            if (doctorList[i] == _address) {
                doctorList[i] = doctorList[doctorList.length - 1];
                doctorList.pop();
                break;
            }
        }
    }

    // Delete patient
    function deletePatient(address _address) public onlyOwner {
        require(isPatient[_address], "Address is not a registered patient");
        delete patients[_address];
        isPatient[_address] = false;
        patientCount--;

        // Remove from patientList
        for (uint256 i = 0; i < patientList.length; i++) {
            if (patientList[i] == _address) {
                patientList[i] = patientList[patientList.length - 1];
                patientList.pop();
                break;
            }
        }
    }

    mapping(address => string) public patientIPFSHashes; // New mapping for IPFS hashes

    // Function to set IPFS hash for a patient
    function setPatientIPFSHash(string memory _ipfsHash) public {
        require(isPatient[msg.sender], "Not registered as patient");
        patientIPFSHashes[msg.sender] = _ipfsHash;
    }

    // Function to retrieve IPFS hash for a patient
    function getPatientIPFSHash(address _address) public view returns (string memory) {
        require(isPatient[_address], "Address is not a registered patient");
        return patientIPFSHashes[_address];
    }
}
