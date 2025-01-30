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
        .then(data => {
            // Fetch stock prices for each company
            const pricePromises = data.map(company => 
                fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${company.symbol}&apikey=HMP0H0GAGO29XMBO`)
                    .then(response => response.json())
                    .then(priceData => {
                        company.stockPrice = priceData['Global Quote']['05. price'];
                        return company;
                    })
            );
            return Promise.all(pricePromises);
        })
        .then(companiesWithPrices => createComparisonTable(companiesWithPrices))
        .catch(error => console.error('Error fetching company data:', error));
}

function createComparisonTable(companies) {
    const container = document.getElementById('small-multiples-container');
    container.innerHTML = '';

    if (companies.length === 0) {
        container.innerHTML = '<p class="no-data">No data available for the selected companies.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'comparison-table';

    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Metric';
    companies.forEach(company => {
        const cell = headerRow.insertCell();
        cell.textContent = company.symbol;
        cell.className = 'company-header';
    });

    const metrics = [
        { name: 'market_cap', label: 'Market Cap' },
        { name: 'revenues', label: 'Revenues' },
        { name: 'net_income', label: 'Net Income' },
        { name: 'stockPrice', label: 'Stock Price' }
    ];

    metrics.forEach((metric, index) => {
        const row = table.insertRow();
        const labelCell = row.insertCell();
        labelCell.textContent = metric.label;
        labelCell.className = 'metric-label';

        companies.forEach(company => {
            const cell = row.insertCell();
            cell.textContent = formatValue(company[metric.name]);
            cell.className = `metric-value ${index % 2 === 0 ? 'even-row' : 'odd-row'}`;
        });
    });

    container.appendChild(table);
}

function formatValue(value) {
    if (!value && value !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        notation: 'compact'
    }).format(value);
}

