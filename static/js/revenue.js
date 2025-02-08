function updateSectorChart() {

    // Fetch data from the /api/groupby_sector endpoint
    fetch('/api/groupby_sector')
        .then(response => {
            console.log('sector response status:', response.status); // Log the response status
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log('Received sector data:', data); // Log the received data

            // Handle the case where no data is received
            if (!data || data.length === 0) {
                console.warn('No data received for sector');
                document.getElementById('sector-chart').innerHTML = 'No data available for sectors.'; // Display a message
                return; // Exit the function
            }

            // Process the data to group by sector
            var sectorData = {}; // Object to store data grouped by sector
            data.forEach(function(d) {
                if (sectorData[d.sector] === undefined) {
                    sectorData[d.sector] = []; // Create an array for the sector if it doesn't exist
                }
                sectorData[d.sector].push(d); // Add the data point to the corresponding sector's array
            });

            // Define an array of colors for the chart
            const colors = [
                '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
                '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
                '#008080', '#e6beff'
            ];

            var traces1 = []; // Array to store the chart traces

            var i = 0; // Counter for iterating through colors
            // Iterate through the grouped sector data
            for (var sector in sectorData) {
                if (sectorData.hasOwnProperty(sector)) {
                    // Create a trace for each sector
                    var trace = {
                        x: sectorData[sector].map(function(d) { return d.rg; }), // Revenue growth data
                        y: sectorData[sector].map(function(d) { return d.nincome; }), // Net income data
                        mode: 'markers', // Use markers to display data points
                        marker: {
                            size: sectorData[sector].map(function(d) { return d.p_cap/1; }), // Market cap data (scaled)
                            sizemode: 'diameter', // Use marker diameter to represent size
                            sizeref:0.05, // Scaling factor for marker size
                            color: colors[i], // Color for the sector
                            colorscale: 'Earth', // Color scale for the markers (not actually used since we are assigning individual colors)
                            hovertemplate: '<b>%{text}</b><br>' + // Hover tooltip content
                                'Revenue Growth: %{x}<br>' +
                                'Net Income: %{y}<br>' +
                                'Market Cap: %{marker.size:,.0f}<extra></extra>' // Market cap with formatting
                        },
                        name:sector, // Sector name for the legend
                        text: sectorData[sector].map(function(d) { return d.label; }) // Company name for the hover tooltip
                    };
                    traces1.push(trace); // Add the trace to the array
                    i++; // Increment the color counter
                }
            }

            // Define the chart layout
            var layout = {
                title: 'Revenue Growth vs Net Income',
                xaxis: {
                    title: 'Revenue Growth'
                },
                yaxis: {
                    title: 'Net Income'
                },
                showlegend: true, // Show the legend
                legend: {
                    orientation: 'h', // Horizontal legend
                    x: 0.55, // Center the legend horizontally
                    y: 1.1, // Position the legend above the chart
                    xanchor: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background for the legend
                    marker:{
                        size:20, // Legend marker size
                        symbol: 'square', // Legend marker shape
                    }
                }
            };

            // Create the Plotly chart
            Plotly.newPlot('sector-chart', traces1, layout);
            responsive:true; // Make the chart responsive (though this line might be misplaced)
        })
        .catch(error => {
            console.error('Error fetching sectors data:', error);
            document.getElementById('sector-chart').innerHTML = 'Error loading chart data. Please try again.'; // Display error message
        });


//     fetch('/api/bubble_sector')
//         .then(response => {
//             console.log('sector response status:', response.status);
//             return response.json();
//         })
//         .then(data => {
//              console.log('Received sector data:', data);
    
//             if (!data || data.length === 0) {
//                 console.warn('No data received for sector');
//                 document.getElementById('sectorbubblechart').innerHTML = 'No data available for sectors.';
//                 return;
//             } 
               
//             // console.log(data)    
//             // var trace2 = {  
//             //     x: data.map(d => d.rg),  
//             //     y: data.map(d => d.nincome), 
//             //     name:data.map(d => d.sector),   
//             //     mode: 'markers',  
//             //     marker: {  
//             //       size: data.map(d =>d.p_cap / 2),  
//             //       sizemode: 'diameter',  
//             //       sizeref: 0.1,  
//             //     //   color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(186, 37, 142)','rgb(192, 237, 30)', 'rgb(198, 27, 233)','rgb(44, 160, 101)','rgb(13, 42, 31)','rgb(119, 160, 44)', 'rgb(255, 65, 54)'], 
//             //       color: data.map(d => d.rg),
//             //       colorscale: "Earth"
                    
//             //     }  
//             //   }; 
              
//             var sectorData = {};  
//             data.forEach(function(d) {  
//             if (sectorData[d.sector] === undefined) {  
//                 sectorData[d.sector] = [];  
//                  }  
//                 sectorData[d.sector].push(d);  
//             });  
  
// // Create an array of traces, one for each sector  
//             const colors = [
//                 '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
//                 '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
//                 '#008080', '#e6beff'
//                 ];
//             var traces = [];  
    
//             var i = 0; 
//             for (var sector in sectorData) {  
//                 if (sectorData.hasOwnProperty(sector)) {  
//                     var trace = {  
//                     x: sectorData[sector].map(function(d) { return d.rg; }),  
//                     y: sectorData[sector].map(function(d) { return d.nincome; }),  
//                     mode: 'markers',  
//                     marker: {  
//                     size: sectorData[sector].map(function(d) { return d.p_cap/3}),  
//                     sizemode: 'diameter',  
//                     sizeref:0.1,  
//                     color: colors[i], 
//                     colorscale: 'Earth' ,
//                     hovertemplate: '<b>%{text}</b><br>' +  
//                        'Revenue Growth: %{x}<br>' +  
//                        'Net Income: %{y}<br>' +  
//                        'Market Cap: %{marker.size:,.0f}<extra></extra>' 
//                     },  
//                     name: sector ,
//                     text: sectorData[sector].map(function(d) { return d.label; })   
//                     };  
//                     traces.push(trace);  
//                     i++;
//                 }  
//             }  
        
// //    
// // Plot the traces  
//         //Plotly.newPlot('myDiv', traces);
//             // var data = [trace2];  
//             var layout = {  
//                 title: 'Consolidated Revenue Growth vs Net Income',  
//                 xaxis: {  
//                   title: 'Revenue Growth'  
//                 },  
//                 yaxis: {  
//                   title: 'Net Income'  
//                 },
//                 showlegend: true,
//                 legend: {
//                     orientation: 'h',  // Set the orientation to horizontal
//                     x: 0.55,           // Center the legend horizontally
//                     y: 1.1,           // Place the legend above the chart
//                     xanchor: 'center',
                    
//                     bgcolor: 'rgba(255, 255, 255, 0.5)',
//                     //itemsizing:constant,
//                     responsive:true,
//                     marker:{
//                         size:20,
//                         itemsizing:'constant',
//                         symbol: 'square',
//                     }
//                 }
//             };  
                
//             //Plotly.newPlot('sectorbubblechart', traces,layout);  
//             Plotly.newPlot('sectorbubblechart', traces, layout).then(function() {  
//                 Plotly.update('sectorbubblechart', {}, layout);  
//               });    
//         })     
//     .catch(error => {
//     console.error('Error fetching top companies data:', error);
//     document.getElementById('top-companies-chart').innerHTML = 'Error loading chart data. Please try again.';
// });
}
document.addEventListener('DOMContentLoaded', function() {
    updateSectorChart();
});