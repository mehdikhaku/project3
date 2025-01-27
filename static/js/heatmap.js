fetch('/api/heatmap-data')
    .then(response => response.json())
    .then(data => {
        // Debugging: Log the fetched data to ensure it's correct
        console.log('Heatmap data:', data);

        // Extract sector names (labels) and corresponding values (market cap percentage)
        const labels = Object.keys(data);  // Sectors
        const values = Object.values(data);  // Corresponding cap percentages

        // Check if data exists and render the heatmap
        if (labels.length && values.length) {
            const ctx = document.getElementById('heatmap-canvas').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Sector Weights (%)',
                        data: values,
                        backgroundColor: [
                            '#4caf50', '#2196f3', '#ff9800', '#e91e63', 
                            '#9c27b0', '#f44336', '#00bcd4', '#ffeb3b'  // Colors for sectors
                        ],
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { 
                            ticks: { 
                                autoSkip: true, 
                                maxTicksLimit: 20 
                            } 
                        }
                    }
                }
            });
        } else {
            console.error('No heatmap data available');
        }
    })
    .catch(error => {
        console.error('Error fetching heatmap data:', error);
    });
