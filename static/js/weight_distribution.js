document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    // Fetch data from the API route
    fetch('/api/weight_distribution')
        .then(response => {
            console.log('API Response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            
            // Prepare data for Plotly
            const trace = {
                x: data.map(d => d.company_count),
                y: data.map(d => d.cumulative_weight * 100), // Convert to percentage
                mode: 'lines+markers',
                type: 'scatter',
                name: 'Weight Distribution',
                hovertemplate: '%{x} companies: %{y:.2f}%<extra></extra>'
            };

            const layout = {
                title: 'Percent of Total S&P Weight vs Number of Companies',
                xaxis: {
                    title: 'Number of Companies',
                    range: [0, 503] // Adjust range based on your dataset
                },
                yaxis: {
                    title: 'Cumulative Weight (%)',
                    range: [0, 100] // Cumulative weight should be within 0-100%
                },
                margin: { t: 50, l: 50, r: 50, b: 50 },
                hovermode: 'closest'
            };

            // Render the chart using Plotly
            Plotly.newPlot('weight-distribution-chart', [trace], layout);
        })
        .catch(error => {
            console.error('Error fetching weight distribution data:', error);
            // Display error message on the page
            document.getElementById('weight-distribution-chart').innerHTML = 'Error loading chart data. Please try again later.';
        });
});
