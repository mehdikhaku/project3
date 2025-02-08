document.addEventListener('DOMContentLoaded', function() {
    // Get references to the search input, dropdown, and store original options
    const searchInput = document.getElementById('company-search');
    const dropdown = document.getElementById('company-dropdown');
    const originalOptions = Array.from(dropdown.options); // Store original options for filtering

    // Add event listener to the search input for filtering
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase(); // Get search term in lowercase
        const filteredOptions = originalOptions.filter(option => 
            option.text.toLowerCase().includes(searchTerm) // Filter options based on search term
        );

        dropdown.innerHTML = ''; // Clear existing dropdown options
        filteredOptions.forEach(option => dropdown.add(option.cloneNode(true))); // Add filtered options back to the dropdown

        // Focus on the first item after filtering if options exist
        if (dropdown.options.length > 0) {
            dropdown.selectedIndex = 0; // Select the first option
            triggerChange(dropdown); // Trigger the change event to fetch data for the first item
        }
    });

    // Add event listener to the dropdown for company selection
    dropdown.addEventListener('change', function () {
        const symbol = this.value; // Get the selected company symbol
        if (symbol || this.selectedIndex === 0) { // Check if a symbol is selected or the first (placeholder) option is selected
            fetchCompanyInfo(symbol); // Fetch and display company information
        } else {
            document.getElementById('company-info').innerHTML = ''; // Clear company info if no symbol is selected
        }
    });

    // Function to fetch company information from the API
    function fetchCompanyInfo(symbol) {
        fetch(`/api/dropdown/${symbol}`) // Fetch data from the specified API endpoint
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                const infoDiv = document.getElementById('company-info'); // Get the div to display company info
                // Populate the company information div with the fetched data
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

    // Function to programmatically trigger a 'change' event on an element
    function triggerChange(element) {
        const event = new Event('change'); // Create a new 'change' event
        element.dispatchEvent(event); // Dispatch the event on the element
    }

    // Initial load: fetch info for the first company in the dropdown
    if (dropdown.options.length > 0) {
        dropdown.selectedIndex = 0; // Select the first option
        triggerChange(dropdown); // Trigger change event to load initial company info
    }
});