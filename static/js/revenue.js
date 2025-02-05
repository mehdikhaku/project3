//import { schemeCategory10 } from 'd3-scale-chromatic';
function updateSectorChart() {

    fetch('/api/groupby_sector')
        .then(response => {
            console.log('sector response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Received sector data:', data);

            if (!data || data.length === 0) {
                console.warn('No data received for sector');
                document.getElementById('sector-chart').innerHTML = 'No data available for sectors.';
                return;
            }
            var sectorData = {};  
            data.forEach(function(d) {  
            if (sectorData[d.sector] === undefined) {  
                sectorData[d.sector] = [];  
            }  
                sectorData[d.sector].push(d);  
            });
            const colors = [
                '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
                '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', 
                '#008080', '#e6beff'
                ];
            var traces1 = [];  
    
            var i = 0; 
            for (var sector in sectorData) {  
                if (sectorData.hasOwnProperty(sector)) {  
                    var trace = {  
                    x: sectorData[sector].map(function(d) { return d.rg; }),  
                    y: sectorData[sector].map(function(d) { return d.nincome; }),  
                    mode: 'markers',  
                    marker: {  
                    size: sectorData[sector].map(function(d) { return d.p_cap/1}),  
                    sizemode: 'diameter',  
                    sizeref:0.05,  
                    color: colors[i], 
                    colorscale: 'Earth',
                    hovertemplate: '<b>%{text}</b><br>' +  
                       'Revenue Growth: %{x}<br>' +  
                       'Net Income: %{y}<br>' +  
                       'Market Cap: %{marker.size:,.0f}<extra></extra>' 
                    },  
                    //name: sectorData[sector].map(function(d) { return d.company; }),
                    name:sector,
                    text: sectorData[sector].map(function(d) { return d.label; })  
                    };  
                    traces1.push(trace);  
                    i++;
                }  
            }   
            var layout = {  
                title: 'Revenue Growth vs Net Income',  
                xaxis: {  
                  title: 'Revenue Growth'  
                },  
                yaxis: {  
                  title: 'Net Income'  
                },
                showlegend: true,
                legend: {
                    orientation: 'h',  // Set the orientation to horizontal
                    x: 0.55,           // Center the legend horizontally
                    y: 1.1,           // Place the legend above the chart
                    xanchor: 'center',
                    
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    //itemsizing:constant,
                    
                    marker:{
                        size:20,
                        //itemsizing:'constant',
                        symbol: 'square',
                    }
                }
            };  
            
                    
            Plotly.newPlot('sector-chart', traces1, layout);
            responsive:true;
        })
        .catch(error => {
            console.error('Error fetching sectors data:', error);
            document.getElementById('sector-chart').innerHTML = 'Error loading chart data. Please try again.';
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