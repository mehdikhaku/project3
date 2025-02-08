// Function to populate the sector dropdown
function populateSectorDropdown() {
    console.log('Fetching sectors...'); // Log that sectors are being fetched

    // Fetch sector data from the /api/sectors endpoint
    fetch('/api/sectors')
        .then(response => {
            console.log('Sectors response status:', response.status); // Log the response status

            // Check if the response is not okay (status outside 200-299 range)
            if (!response.ok) {
                // If not ok, get the error text from the response for logging.
                return response.text().then(text => {
                    console.error('Error response:', text); // Log the error text
                    throw new Error('Network response was not ok'); // Throw an error to be caught later
                });
            }
            return response.json(); // Parse the response as JSON if it's okay
        })
        .then(sectors => {
            console.log('Sectors received:', sectors); // Log the received sectors data

            const sectorSelect = document.getElementById('sector-select'); // Get the sector select element
            sectorSelect.innerHTML = '<option value="All">All Sectors</option>'; // Add the "All Sectors" option

            // Handle the case where no sectors are received
            if (sectors.length === 0) {
                console.warn('No sectors received from API'); // Log a warning
            }

            // Iterate over the received sectors and add them to the dropdown
            sectors.forEach(sector => {
                console.log('Adding sector:', sector); // Log the sector being added
                const option = document.createElement('option'); // Create a new option element
                option.value = sector; // Set the option value
                option.textContent = sector; // Set the option text (what the user sees)
                sectorSelect.appendChild(option); // Add the option to the dropdown
            });
        })
        .catch(error => {
            console.error('Error fetching sectors:', error); // Log any errors that occurred during the fetch

            // Display an error message to the user (a better way would be to have a designated error area)
            const errorDiv = document.createElement('div'); 
            errorDiv.textContent = 'Error loading sectors. Please try again.';
            document.body.appendChild(errorDiv);
        });
}

// Function to update the top companies chart
function updateTopCompaniesChart() {
    const metric = document.getElementById('metric-select').value; // Get the selected metric
    const sector = document.getElementById('sector-select').value; // Get the selected sector

    console.log(`Fetching top companies: Metric=${metric}, Sector=${sector}`); // Log the fetch parameters

    // Fetch top companies data from the API, including the selected metric and sector
    fetch(`/api/top_companies?metric=${metric}&sector=${sector}`)
        .then(response => {
            console.log('Top companies response status:', response.status); // Log the response status
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log('Received top companies data:', data); // Log the received data

            // Handle the case where no data is received
            if (!data || data.length === 0) {
                console.warn('No data received for top companies'); // Log a warning
                document.getElementById('top-companies-chart').innerHTML = 'No data available for the selected criteria.'; // Display a message in the chart area
                return; // Exit the function
            }

            // Prepare the data for the Plotly bar chart
            const trace = {
                x: data.map(d => d.company), // Company names for the x-axis
                y: data.map(d => d.value), // Metric values for the y-axis
                type: 'bar', // Bar chart type
                text: data.map(d => d.value.toLocaleString()), // Metric values as text for display on bars
                textposition: 'auto', // Automatically position the text on the bars
                marker: {
                    color: 'rgb(9, 92, 53)', // Set bar color (greenish)
                    line: {
                        color: 'rgb(0, 12, 6)', // Set bar border color (darker green)
                        width: 1.5 // Set bar border width
                    }
                }
            };

            const layout = {
                title: {
                    text: `Top 5 Companies by ${metric.replace('_', ' ')}`, // Set chart title based on selected metric
                    font: {
                        color: '#333' // Set title font color
                    }
                },
                xaxis: {
                    title: 'Company', // Set x-axis title
                    tickfont: {
                        color: '#333' // Set x-axis tick font color
                    }
                },
                yaxis: {
                    title: metric.replace('_', ' '), // Set y-axis title based on selected metric
                    tickfont: {
                        color: '#333' // Set y-axis tick font color
                    }
                },
                plot_bgcolor: '#ffffff', // Set plot background color
                paper_bgcolor: '#ffffff', // Set paper background color
                font: {
                    color: '#333' // Set default font color
                },
                margin: { t: 50, l: 50, r: 50, b: 50 } // Set chart margins
            };

            // Create the Plotly chart
            Plotly.newPlot('top-companies-chart', [trace], layout, {
                responsive: true, // Make the chart responsive
                displaylogo: false, // Hide the Plotly logo
                modeBarButtonsToRemove: ['pan2d', 'lasso2d'] // Remove unwanted mode bar buttons
            });
        })
        .catch(error => {
            console.error('Error fetching top companies data:', error); // Log any errors
            document.getElementById('top-companies-chart').innerHTML = 'Error loading chart data. Please try again.'; // Display an error message in the chart area
        });
}

// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    populateSectorDropdown(); // Populate the sector dropdown
    updateTopCompaniesChart(); // Update the top companies chart (initial load)

    // Add event listeners to the metric and sector select elements to update the chart when their values change
    document.getElementById('metric-select').addEventListener('change', updateTopCompaniesChart);
    document.getElementById('sector-select').addEventListener('change', updateTopCompaniesChart);
});