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
                y: data.map(d => d.cumulative_weight * 100),
                mode: 'lines+markers',
                type: 'scatter',
                name: 'Weight Distribution',
                hovertemplate: '%{x} companies: %{y:.2f}%<extra></extra>',
                line: {
                    color: 'rgb(14, 87, 18)',  // Explicit RGB orange
                    width: 2
                },
                marker: {
                    color: 'rgb(14, 87, 18)',  // Matching marker color
                    size: 6
                }
            };
            

            const layout = {
                title: {
                    text: 'Percent of Total S&P Weight vs Number of Companies',
                    font: {
                        color: '#333'
                    }
                },
                xaxis: {
                    title: {
                        text: 'Number of Companies',
                        font: {
                            color: '#333'
                        }
                    },
                    range: [0, 503],
                    gridcolor: '#e6e6e6',
                    zerolinecolor: '#e6e6e6',
                    tickcolor: '#333',
                    tickfont: {
                        color: '#333'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Cumulative Weight (%)',
                        font: {
                            color: '#333'
                        }
                    },
                    range: [0, 100],
                    gridcolor: '#e6e6e6',
                    zerolinecolor: '#e6e6e6',
                    tickcolor: '#333',
                    tickfont: {
                        color: '#333'
                    }
                },
                margin: { t: 50, l: 50, r: 50, b: 50 },
                hovermode: 'closest',
                plot_bgcolor: '#ffffff',
                paper_bgcolor: '#ffffff',
                font: {
                    color: '#333'
                }
            };

            // Render the chart using Plotly
            Plotly.newPlot('weight-distribution-chart', [trace], layout, {
                responsive: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['pan2d', 'lasso2d']
            });
        })
        .catch(error => {
            console.error('Error fetching weight distribution data:', error);
            // Display error message on the page
            document.getElementById('weight-distribution-chart').innerHTML = 'Error loading chart data. Please try again later.';
        });
});
