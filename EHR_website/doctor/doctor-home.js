document.addEventListener('DOMContentLoaded', () => {
    addPatientSearchFunctionality();
});

function addPatientSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('patientTable');
    const rows = table.querySelectorAll('tbody tr');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchValue = searchInput.value.toLowerCase();

            rows.forEach(row => {
                const cells = row.getElementsByTagName('td');
                const textContent = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(' ');

                if (textContent.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}
addPatientSearchFunctionality();
