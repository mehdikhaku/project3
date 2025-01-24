fetch('/api/heatmap-data')
    .then(response => response.json())
    .then(data => {
        const labels = Object.keys(data);
        const values = Object.values(data);

        const ctx = document.getElementById('heatmap-canvas').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sector Weights (%)',
                    data: values,
                    backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#e91e63'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    });
