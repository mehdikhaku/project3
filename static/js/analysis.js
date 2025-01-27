document.getElementById('company-dropdown').addEventListener('change', function() {
    var companySymbol = this.value;
    
    if (companySymbol) {
        fetch('/api/company-info/' + companySymbol)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Company not found');
                } else {
                    // Display the company data dynamically
                    document.getElementById('company-name').innerText = "Company Name: " + data.company_name;
                    document.getElementById('sector').innerText = "Sector: " + data.sector;
                    document.getElementById('market-cap').innerText = "Market Cap: " + data.market_cap;
                    document.getElementById('business-summary').innerText = "Business Summary: " + data.business_summary;
                    document.getElementById('total-employees').innerText = "Total Employees: " + data.total_employees;
                    document.getElementById('revenues').innerText = "Revenues: " + data.revenues;
                }
            })
            .catch(error => {
                console.error('Error fetching company data:', error);
            });
    } else {
        // Clear company info if no company is selected
        document.getElementById('company-name').innerText = '';
        document.getElementById('sector').innerText = '';
        document.getElementById('market-cap').innerText = '';
        document.getElementById('business-summary').innerText = '';
        document.getElementById('total-employees').innerText = '';
        document.getElementById('revenues').innerText = '';
    }
});
