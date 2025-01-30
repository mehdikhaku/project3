function populateSectorDropdown() {
    console.log('Fetching sectors...');
    fetch('/api/sectors')
    .then(response => {
        console.log('Sectors response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response:', text);
                throw new Error('Network response was not ok');
            });
        }
        return response.json();
    })
    .then(sectors => {
        console.log('Sectors received:', sectors);
        const sectorSelect = document.getElementById('sector-select');
        sectorSelect.innerHTML = '<option value="All">All Sectors</option>';
        if (sectors.length === 0) {
            console.warn('No sectors received from API');
        }
        sectors.forEach(sector => {
            console.log('Adding sector:', sector);
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            sectorSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching sectors:', error);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Error loading sectors. Please try again.';
        document.body.appendChild(errorDiv);
    });
}

function updateTopCompaniesChart() {
    const metric = document.getElementById('metric-select').value;
    const sector = document.getElementById('sector-select').value;

    console.log(`Fetching top companies: Metric=${metric}, Sector=${sector}`);

    fetch(`/api/top_companies?metric=${metric}&sector=${sector}`)
        .then(response => {
            console.log('Top companies response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Received top companies data:', data);

            if (!data || data.length === 0) {
                console.warn('No data received for top companies');
                document.getElementById('top-companies-chart').innerHTML = 'No data available for the selected criteria.';
                return;
            }

            const trace = {
                x: data.map(d => d.company),
                y: data.map(d => d.value),
                type: 'bar',
                text: data.map(d => d.value.toLocaleString()),
                textposition: 'auto',
                marker: {
                    color: 'rgb(9, 92, 53)',  // Orange color
                    line: {
                        color: 'rgb(0, 12, 6)',
                        width: 1.5
                    }
                }
            };

            const layout = {
                title: {
                    text: `Top 5 Companies by ${metric.replace('_', ' ')}`,
                    font: {
                        color: '#333'
                    }
                },
                xaxis: { 
                    title: 'Company',
                    tickfont: {
                        color: '#333'
                    }
                },
                yaxis: { 
                    title: metric.replace('_', ' '),
                    tickfont: {
                        color: '#333'
                    }
                },
                plot_bgcolor: '#ffffff',
                paper_bgcolor: '#ffffff',
                font: {
                    color: '#333'
                },
                margin: { t: 50, l: 50, r: 50, b: 50 }
            };

            Plotly.newPlot('top-companies-chart', [trace], layout, {
                responsive: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['pan2d', 'lasso2d']
            });
        })
        .catch(error => {
            console.error('Error fetching top companies data:', error);
            document.getElementById('top-companies-chart').innerHTML = 'Error loading chart data. Please try again.';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    populateSectorDropdown();
    updateTopCompaniesChart();
    
    document.getElementById('metric-select').addEventListener('change', updateTopCompaniesChart);
    document.getElementById('sector-select').addEventListener('change', updateTopCompaniesChart);
});
