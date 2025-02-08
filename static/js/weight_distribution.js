document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded'); // Log when the DOM is fully loaded

    // Fetch data from the /api/weight_distribution API endpoint
    fetch('/api/weight_distribution')
        .then(response => {
            console.log('API Response:', response); // Log the API response
            return response.json(); // Parse the response body as JSON
        })
        .then(data => {
            console.log('Data received:', data); // Log the received data

            // Prepare data for Plotly chart
            const trace = {
                x: data.map(d => d.company_count), // Map company counts to the x-axis
                y: data.map(d => d.cumulative_weight * 100), // Map cumulative weights (multiplied by 100 for percentage) to the y-axis
                mode: 'lines+markers', // Display both lines and markers on the chart
                type: 'scatter', // Specify a scatter plot
                name: 'Weight Distribution', // Set the trace name (for legend/tooltips)
                hovertemplate: '%{x} companies: %{y:.2f}%<extra></extra>', // Customize hover tooltip content
                line: {
                    color: 'rgb(14, 87, 18)', // Set line color (dark green) using RGB
                    width: 2 // Set line width
                },
                marker: {
                    color: 'rgb(14, 87, 18)', // Set marker color (same as line)
                    size: 6 // Set marker size
                }
            };

            const layout = {
                title: {
                    text: 'Percent of Total S&P Weight vs Number of Companies', // Set chart title
                    font: {
                        color: '#333' // Set title font color (dark gray)
                    }
                },
                xaxis: {
                    title: {
                        text: 'Number of Companies', // Set x-axis title
                        font: {
                            color: '#333' // Set x-axis title font color
                        }
                    },
                    range: [0, 503], // Set x-axis range
                    gridcolor: '#e6e6e6', // Set grid line color (light gray)
                    zerolinecolor: '#e6e6e6', // Set zero line color (light gray)
                    tickcolor: '#333', // Set tick color (dark gray)
                    tickfont: {
                        color: '#333' // Set tick font color
                    }
                },
                yaxis: {
                    title: {
                        text: 'Cumulative Weight (%)', // Set y-axis title
                        font: {
                            color: '#333' // Set y-axis title font color
                        }
                    },
                    range: [0, 100], // Set y-axis range (0-100 for percentage)
                    gridcolor: '#e6e6e6', // Set grid line color
                    zerolinecolor: '#e6e6e6', // Set zero line color
                    tickcolor: '#333', // Set tick color
                    tickfont: {
                        color: '#333'  // Set tick font color
                    }
                },
                margin: { t: 50, l: 50, r: 50, b: 50 }, // Set margins around the chart
                hovermode: 'closest', // Set hover interaction mode
                plot_bgcolor: '#ffffff', // Set plot background color (white)
                paper_bgcolor: '#ffffff', // Set paper background color (white)
                font: {
                    color: '#333' // Set default font color for the chart
                }
            };

            // Render the chart using Plotly
            Plotly.newPlot('weight-distribution-chart', [trace], layout, {
                responsive: true, // Make the chart responsive
                displaylogo: false, // Hide the Plotly logo
                modeBarButtonsToRemove: ['pan2d', 'lasso2d'] // Remove unwanted mode bar buttons
            });
        })
        .catch(error => {
            console.error('Error fetching weight distribution data:', error);
            // Display error message in the chart container
            document.getElementById('weight-distribution-chart').innerHTML = 'Error loading chart data. Please try again later.';
        });
});