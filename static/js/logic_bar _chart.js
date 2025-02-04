<head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.1/xlsx.full.min.js"></script>
</head>
<body>
    <input type="file" id="excelFile" />
    <div id="stockChart" style="width:100%; height:500px;"></div>

    <script>
        // Function to handle file upload and read Excel file
        document.getElementById('excelFile').addEventListener('change', handleFile, false);

        function handleFile(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const data = e.target.result;

                // Parse the Excel data using xlsx.js
                const workbook = XLSX.read(data, { type: 'binary' });

                // Assume the data is in the first sheet
                const sheet = workbook.Sheets[workbook.SheetNames[0]];

                // Convert sheet data into JSON format
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                // Extract data from the columns: Year, avg_closing_price, open_price, high_price, low_price, close_price
                const years = jsonData.map(row => row.year);
                const avgClosingPrices = jsonData.map(row => row.avg_closing_price);
                const openPrices = jsonData.map(row => row.open_price);
                const highPrices = jsonData.map(row => row.high_price);
                const lowPrices = jsonData.map(row => row.low_price);
                const closePrices = jsonData.map(row => row.close_price);

                // Create traces for the bar chart
                const trace1 = {
                    x: years,
                    y: avgClosingPrices,
                    name: 'Average Closing Price',
                    type: 'bar',
                    marker: { color: 'rgb(255, 99, 132)', opacity: 0.7 }
                };

                const trace2 = {
                    x: years,
                    y: openPrices,
                    name: 'Opening Price',
                    type: 'bar',
                    marker: { color: 'rgb(54, 162, 235)', opacity: 0.7 }
                };

                const trace3 = {
                    x: years,
                    y: highPrices,
                    name: 'High Price',
                    type: 'bar',
                    marker: { color: 'rgb(75, 192, 192)', opacity: 0.7 }
                };

                const trace4 = {
                    x: years,
                    y: lowPrices,
                    name: 'Low Price',
                    type: 'bar',
                    marker: { color: 'rgb(153, 102, 255)', opacity: 0.7 }
                };

                const trace5 = {
                    x: years,
                    y: closePrices,
                    name: 'Closing Price',
                    type: 'bar',
                    marker: { color: 'rgb(255, 159, 64)', opacity: 0.7 }
                };

                const data = [trace1, trace2, trace3, trace4, trace5];

                const layout = {
                    barmode: 'group',
                    title: 'Stock Market Performance Over Years',
                    xaxis: { title: 'Year' },
                    yaxis: { title: 'Price (USD)' },
                    showlegend: true
                };

                // Render the Plotly chart
                Plotly.newPlot('stockChart', data, layout);
            };

            // Read the file as a binary string
            reader.readAsBinaryString(file);
        }
    </script>
</body>
