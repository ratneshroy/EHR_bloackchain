// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EHR {
    struct MedicalRecord {
        string recordData;
    }

    struct Appointment {
        string appointmentId;
        string patientId;
        string doctorId;
        string details;
    }

    struct Patient {
        string id;
        string details;
        bool exists;
    }

    struct Doctor {
        string id;
        string details;
        string specialty;
        bool exists;
    }

    address public admin;
    mapping(string => Patient) public patients; // patientId -> Patient
    mapping(string => Doctor) public doctors; // doctorId -> Doctor
    mapping(string => MedicalRecord[]) public medicalRecords; // patientId -> MedicalRecord[]
    mapping(string => Appointment[]) public patientAppointments; // patientId -> Appointment[]
    mapping(string => Appointment[]) public doctorAppointments; // doctorId -> Appointment[]
    mapping(string => string[]) public specialtyToDoctors;

    string[] public patientList;
    string[] public doctorList;
    mapping(address => bool) public isAdmin;

    event PatientAdded(string patientId, string name);
    event PatientRemoved(string patientId);
    event DoctorAdded(string doctorId, string name, string specialty);
    event DoctorRemoved(string doctorId);
    event AppointmentAdded(
        string appointmentId,
        string patientId,
        string doctorId,
        string details
    );
    event AppointmentUpdated(
        string appointmentId,
        string patientId,
        string doctorId,
        string details
    );
    event AppointmentRemoved(
        string appointmentId,
        string patientId,
        string doctorId
    );

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender;
        isAdmin[admin] = true;
    }

    // Add a new patient
    function addPatient(
        string memory _patientId,
        string memory _details
    ) public onlyAdmin {
        require(!patients[_patientId].exists, "Patient already exists");
        patients[_patientId] = Patient(_patientId, _details, true);
        patientList.push(_patientId);
        emit PatientAdded(_patientId, _details);
    }

    // Get patient details
    function getPatient(
        string memory _patientId
    ) public view returns (string memory) {
        require(patients[_patientId].exists, "Patient does not exist");
        return patients[_patientId].details;
    }

    function removePatient(string memory _patientId) public onlyAdmin {
        require(patients[_patientId].exists, "Patient does not exist");

        // Remove all medical records
        delete medicalRecords[_patientId];

        // Remove all appointments
        delete patientAppointments[_patientId];

        // Remove from patientList
        for (uint256 i = 0; i < patientList.length; i++) {
            if (keccak256(abi.encodePacked(patientList[i])) == keccak256(abi.encodePacked(_patientId))) {
                patientList[i] = patientList[patientList.length - 1];
                patientList.pop();
                break;
            }
        }

        // Remove from mapping
        delete patients[_patientId];

        emit PatientRemoved(_patientId);
    }

    // Add a medical record to a patient
    function addMedicalRecord(
        string memory _patientId,
        string memory _recordData
    ) public onlyAdmin {
        require(patients[_patientId].exists, "Patient does not exist");
        medicalRecords[_patientId].push(MedicalRecord(_recordData));
    }

    // Get all medical records for a patient
    function getMedicalRecords(
        string memory _patientId
    ) public view returns (MedicalRecord[] memory) {
        require(patients[_patientId].exists, "Patient does not exist");
        return medicalRecords[_patientId];
    }

    // Add a new doctor
    function addDoctor(
        string memory _doctorId,
        string memory _details,
        string memory _specialty
    ) public onlyAdmin {
        require(!doctors[_doctorId].exists, "Doctor already exists");
        doctors[_doctorId] = Doctor(_doctorId, _details, _specialty, true);
        doctorList.push(_doctorId);
        specialtyToDoctors[_specialty].push(_doctorId);
        emit DoctorAdded(_doctorId, _details, _specialty);
    }

    // Get doctor details
    function getDoctor(
        string memory _doctorId
    ) public view returns (string memory, string memory) {
        require(doctors[_doctorId].exists, "Doctor does not exist");
        return (doctors[_doctorId].details, doctors[_doctorId].specialty);
    }

    function removeDoctor(string memory _doctorId) public onlyAdmin {
        require(doctors[_doctorId].exists, "Doctor does not exist");

        // Remove all appointments
        delete doctorAppointments[_doctorId];

        // Remove from specialty list
        string memory specialty = doctors[_doctorId].specialty;
        string[] storage doctorIds = specialtyToDoctors[specialty];
        for (uint256 i = 0; i < doctorIds.length; i++) {
            if (keccak256(abi.encodePacked(doctorIds[i])) == keccak256(abi.encodePacked(_doctorId))) {
                doctorIds[i] = doctorIds[doctorIds.length - 1];
                doctorIds.pop();
                break;
            }
        }

        // Remove from doctorList
        for (uint256 i = 0; i < doctorList.length; i++) {
            if (keccak256(abi.encodePacked(doctorList[i])) == keccak256(abi.encodePacked(_doctorId))) {
                doctorList[i] = doctorList[doctorList.length - 1];
                doctorList.pop();
                break;
            }
        }

        // Remove from mapping
        delete doctors[_doctorId];

        emit DoctorRemoved(_doctorId);
    }

    // Add an appointment between a patient and a doctor
    function addAppointment(
        string memory _appointmentId,
        string memory _patientId,
        string memory _doctorId,
        string memory _details
    ) public onlyAdmin {
        require(patients[_patientId].exists, "Patient does not exist");
        require(doctors[_doctorId].exists, "Doctor does not exist");

        Appointment memory appointment = Appointment(
            _appointmentId,
            _patientId,
            _doctorId,
            _details
        );
        patientAppointments[_patientId].push(appointment);
        doctorAppointments[_doctorId].push(appointment);

        emit AppointmentAdded(_appointmentId, _patientId, _doctorId, _details);
    }

    // Get appointments for a specific patient
    function getPatientAppointments(
        string memory _patientId
    ) public view returns (Appointment[] memory) {
        require(patients[_patientId].exists, "Patient does not exist");
        return patientAppointments[_patientId];
    }

    // Get appointments for a specific doctor
    function getDoctorAppointments(
        string memory _doctorId
    ) public view returns (Appointment[] memory) {
        require(doctors[_doctorId].exists, "Doctor does not exist");
        return doctorAppointments[_doctorId];
    }

    // Update an appointment
    function updateAppointment(
        string memory _appointmentId,
        string memory _patientId,
        string memory _doctorId,
        string memory _details
    ) public onlyAdmin {
        require(patients[_patientId].exists, "Patient does not exist");
        require(doctors[_doctorId].exists, "Doctor does not exist");

        Appointment[] storage patientAppts = patientAppointments[_patientId];
        Appointment[] storage doctorAppts = doctorAppointments[_doctorId];

        bool found = false;
        for (uint256 i = 0; i < patientAppts.length; i++) {
            if (keccak256(abi.encodePacked(patientAppts[i].appointmentId)) == keccak256(abi.encodePacked(_appointmentId))) {
                patientAppts[i].details = _details;
                found = true;
                break;
            }
        }

        for (uint256 j = 0; j < doctorAppts.length; j++) {
            if (keccak256(abi.encodePacked(doctorAppts[j].appointmentId)) == keccak256(abi.encodePacked(_appointmentId))) {
                doctorAppts[j].details = _details;
                break;
            }
        }

        require(found, "Appointment not found");
        emit AppointmentUpdated(
            _appointmentId,
            _patientId,
            _doctorId,
            _details
        );
    }

    // Remove an appointment
    function removeAppointment(
        string memory _appointmentId,
        string memory _patientId,
        string memory _doctorId
    ) public onlyAdmin {
        require(patients[_patientId].exists, "Patient does not exist");
        require(doctors[_doctorId].exists, "Doctor does not exist");

        _removeAppointment(patientAppointments[_patientId], _appointmentId);
        _removeAppointment(doctorAppointments[_doctorId], _appointmentId);

        emit AppointmentRemoved(_appointmentId, _patientId, _doctorId);
    }

    function _removeAppointment(
        Appointment[] storage appointments,
        string memory _appointmentId
    ) internal {
        for (uint256 i = 0; i < appointments.length; i++) {
            if (keccak256(abi.encodePacked(appointments[i].appointmentId)) == keccak256(abi.encodePacked(_appointmentId))) {
                appointments[i] = appointments[appointments.length - 1];
                appointments.pop();
                break;
            }
        }
    }

    function getDoctorsBySpecialty(
        string memory _specialty
    ) public view returns (string[] memory) {
        return specialtyToDoctors[_specialty];
    }

    // Admin functions
    function checkAdmin(address _address) public view returns (bool) {
        return isAdmin[_address];
    }

    function addAdmin(address _admin) public onlyAdmin {
        isAdmin[_admin] = true;
    }

    function removeAdmin(address _admin) public onlyAdmin {
        isAdmin[_admin] = false;
    }

    // Get all patient IDs
    function getPatientList() public view returns (string[] memory) {
        return patientList;
    }

    // Get all doctor IDs
    function getDoctorList() public view returns (string[] memory) {
        return doctorList;
    }
}
