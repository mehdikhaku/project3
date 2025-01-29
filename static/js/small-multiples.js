document.addEventListener('DOMContentLoaded', function () {
    const compareButton = document.getElementById('compare-button');
    const companySelect = document.getElementById('company-select');

    compareButton.addEventListener('click', function () {
        const selectedCompanies = Array.from(companySelect.selectedOptions).map(option => option.value);

        if (selectedCompanies.length > 3) {
            alert('Please select up to 3 companies');
            return;
        }

        if (selectedCompanies.length === 0) {
            alert('Please select at least one company');
            return;
        }

        fetchCompanyData(selectedCompanies);
    });
});

function fetchCompanyData(symbols) {
    fetch(`/api/companies?symbols=${symbols.join(',')}`)
        .then(response => response.json())
        .then(data => createComparisonTable(data))
        .catch(error => console.error('Error fetching company data:', error));
}

function createComparisonTable(companies) {
    const container = document.getElementById('small-multiples-container');
    container.innerHTML = ''; // Clear previous content

    if (companies.length === 0) {
        container.innerHTML = '<p>No data available for the selected companies.</p>';
        return;
    }

    // Create table
    const table = document.createElement('table');
    table.className = 'comparison-table';

    // Create header row with company names
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Metric'; // First cell for metric names
    companies.forEach(company => {
        const cell = headerRow.insertCell();
        cell.textContent = company.symbol; // Add company symbol as column header
        cell.style.textAlign = 'center';
    });

    // Add rows for each metric
    const metrics = ['market_cap', 'revenues', 'net_income'];
    metrics.forEach(metric => {
        const row = table.insertRow();
        row.insertCell().textContent = metric.replace('_', ' ').toUpperCase(); // Metric name

        companies.forEach(company => {
            const cell = row.insertCell();
            cell.textContent = formatValue(company[metric]); // Metric value for each company
            cell.style.textAlign = 'center';
        });
    });

    container.appendChild(table);
}

function formatValue(value) {
    // Format large numbers for readability (e.g., 1500000000 -> $1.5B)
    if (!value && value !== 0) return 'N/A'; // Handle missing or null values
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        notation: 'compact'
    }).format(value);
}
