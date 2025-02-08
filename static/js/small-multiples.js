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

async function fetchPrice(symbol) {
    try {
        const response = await fetch(`/api/alpha_vantage/${symbol}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error for ${symbol}: ${response.status} - ${errorText}`);
            return null; // Return null to explicitly indicate failure
        }
        const data = await response.json();

        // Check for the presence of the required data and that it's a valid number.
        const priceString = data?.['Global Quote']?.['05. price']; // Use optional chaining
        if (priceString) {
          const price = parseFloat(priceString);
          if (!isNaN(price)) {
            return price;
          } else {
            console.error("Price is NaN:", priceString);
          }
        }

        console.error("Unexpected or missing price data:", data);
        return null; // Return null if price data is missing or invalid

    } catch (error) {
        console.error(`Fetch Error for ${symbol}:`, error);
        return null;  // Return null on fetch error
    }
}


async function fetchCompanyData(symbols) {
    try {
        const response = await fetch(`/api/companies?symbols=${symbols.join(',')}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();

        const companiesWithPrices = await Promise.all(
            data.map(async (company, index) => {
                await new Promise(resolve => setTimeout(resolve, index * 1500)); // Rate limiting
                const price = await fetchPrice(company.symbol);
                company.stockPrice = price; // Assign the price (which could be null)
                return company;
            })
        );

        createComparisonTable(companiesWithPrices);
    } catch (error) {
        console.error('Error fetching company data:', error);
        const container = document.getElementById('small-multiples-container');
        container.innerHTML = `<p class="error">An error occurred: ${error.message}</p>`;
    }
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
            const value = company[metric.name];
            cell.textContent = formatValue(value);  // formatValue now handles null
            cell.className = `metric-value ${index % 2 === 0 ? 'even-row' : 'odd-row'}`;
        });
    });

    container.appendChild(table);
}

function formatValue(value) {
  if (value === null || value === undefined) return 'N/A'; // Explicitly check for null and undefined
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        notation: 'compact'
    }).format(value);
}