document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('company-search');
    const dropdown = document.getElementById('company-dropdown');
    const originalOptions = Array.from(dropdown.options);

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredOptions = originalOptions.filter(option => 
            option.text.toLowerCase().includes(searchTerm)
        );

        dropdown.innerHTML = '';
        filteredOptions.forEach(option => dropdown.add(option.cloneNode(true)));

        // Focus on the first item after filtering
        if (dropdown.options.length > 0) {
            dropdown.selectedIndex = 0;
            triggerChange(dropdown);
        }
    });

    dropdown.addEventListener('change', function () {
        const symbol = this.value;
        if (symbol || this.selectedIndex === 0) {
            fetchCompanyInfo(symbol);
        } else {
            document.getElementById('company-info').innerHTML = '';
        }
    });

    function fetchCompanyInfo(symbol) {
        fetch(`/api/dropdown/${symbol}`)
            .then(response => response.json())
            .then(data => {
                const infoDiv = document.getElementById('company-info');
                infoDiv.innerHTML = `
                    <p><strong>Company:</strong> ${data['Company Name']}</p>
                    <p><strong>City:</strong> ${data['City']}</p>
                    <p><strong>State:</strong> ${data['State']}</p>
                    <p><strong>Country:</strong> ${data['Country']}</p>                                
                    <p><strong>Sector:</strong> ${data['Sector']}</p>
                    <p><strong>Industry:</strong> ${data['Industry']}</p>                
                    <p><strong>Employees:</strong> ${data['Fulltime Employees']}</p>
                    <p><strong>Business Summary:</strong> ${data['Business Summary']}</p>
                `;
            });
    }

    function triggerChange(element) {
        const event = new Event('change');
        element.dispatchEvent(event);
    }

    // Initial load of the first company
    if (dropdown.options.length > 0) {
        dropdown.selectedIndex = 0;
        triggerChange(dropdown);
    }
});
