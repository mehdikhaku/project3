fetch('/api/graph-data')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('analysis-graph').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.x,
                datasets: [{
                    label: 'Market Cap Weight (%)',
                    data: data.y,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
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
