// scatter_plot.js

// Fetch the data for the scatter plot
fetch('/scatter_data')
    .then(response => response.json())
    .then(data => {
        // Extract data fields for the plot
        const revGrowth = data.map(item => item.rev_growth);
        const netIncome = data.map(item => item.net_income);
        const marketCap = data.map(item => item.market_cap);
        const sector = data.map(item => item.sector);
        const symbols = data.map(item => item.symbol);

        // Create the scatter plot using Plotly
        const trace = {
            x: revGrowth,
            y: netIncome,
            text: symbols,
            mode: 'markers',
            marker: {
                size: marketCap.map(size => Math.sqrt(size) / 1000),
                color: sector.map((s, i) => i),
                colorscale: 'Viridis',
                showscale: true,
                line: {
                    width: 1,
                    color: '#000'
                }
            },
            hovertemplate: 
                '<b>%{text}</b><br>' +
                'Revenue Growth: %{x}<br>' +
                'Net Income: %{y}<br>' +
                '<extra></extra>'
        };

        const layout = {
            title: 'Bubble Chart: Revenue Growth vs. Net Income',
            xaxis: {
                title: 'Revenue Growth (%)',
                zeroline: false
            },
            yaxis: {
                title: 'Net Income (in Millions)',
                zeroline: false
            },
            height: 600,
            showlegend: false
        };

        Plotly.newPlot('scatter_plot', [trace], layout);
    })
    .catch(error => {
        console.error('Error fetching scatter data:', error);
    });
