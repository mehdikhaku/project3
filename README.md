# project3

## S&P 500 Interactive Stock Market Visualization Tool

### Project Overview
The project aims to develop an Interactive Stock Market Visualization Tool to help users analyze historical stock market performance for the S&P 500 through a dynamic dashboard. It will feature historical stock data with interactive visualizations, such as time-series charts, comparative performance analysis, and a sector-based heatmap.

### How to Use the Project

#### 1. Setup & Installation
- Clone repository
- Create a virtual environment
- Install dependencies
##### 2. Run the Flask App 
- Start the server
- Open the web app

### Interact with the Dashboard
- Use the sector filter to view specific industries.
- Search for a specific company using the search bar.
- Explore interactive maps with heatmaps & markers.
- View statistical insights about company distribution.

### Ethical Considerations
#### - Data Transparency:
The tool sources publicly available stock data and ensures clear citation of all sources.
#### - Privacy & Security: 
No personal or sensitive user data is collected or stored.
#### - Bias Awareness: 
The tool represents financial trends without misleading visualizations, ensuring fairness and objectivity in stock data interpretation.
#### - Open Source: 
The project is fully open-source, allowing improvements and contributions from the developer community.

### Data Sources
The stock market and company data were sourced from:

Yahoo Finance API (Stock Price Data)

PostgreSQL Database (pgAdmin) (Company Locations & Metadata)

S&P 500 Company List (Updated industry & financial details)

### External Code References
The project utilizes the following open-source libraries:

Flask - Backend API for data retrieval

psycopg2 - PostgreSQL integration

Leaflet.js - Interactive map rendering

Leaflet.heat - Heatmap visualization

D3.js - Data-driven visualizations (for future expansion)

### Technologies used
- HTML: To structure the content of the web pages.
- CSS: To style and designe the web pages.
- JavaScript: To add interactivity and functionality to the website.
- API: To integrate external data or services into the application.
- PostgreSQL: To manage relational database information.
- Python Libraries:
    - Flask: To build the backend web server.
    - Pandas: To analyse and manipulate the data.
    - Requests: To make API calls.
    - psycopg2: To interact with the PostgreSQL database.
- D3.js: To create dynamic and interactive data visualizations.
- Leaflet.js: To render interactive maps and geospatial data visualization.

### Some of the used objects, methods and functions 
- addEventListener: To attach an event listener to a specified HTML element.
- hasOwnProperty: To  check whether an object has a specific property as its own.
- console.warn: To log warning messages to the browser's console.
- map: to create a new array by applying a function to each element in an existing array.
- DOMContentLoaded: To ensure that the script runs only after the HTML structure is fully loaded.
- parseFloat: To convert a string/value into a float number.
- getElementById: To select an HTML element based on its id attribute.
- newPlot: To create/update interactive plots in web applications.
- Object.entries: To convert the object into an array.
- sort: To sort the array of key-value pairs in descending order based on the values.
- Slide: To extract the top num items from the sorted array.
- Join: To Combine the array of strings into a single string, separated by commas.
- .Style: To modify the styles of an HTML element. 
- Jsonify: To convert the dictionary into Json format and be able to set the appropriate content type in the Http response.
- Math.max: To set the front size to 20% of rectangle’s size and ensure that the front size is at least 12px for readability.
- Math.abs: To ensure is always positive and *10 scales the size proportionally.

## Outline of Site Pages & Visualizations

The site contains the following tabs:

### Home tab

#### S&P 500 Annual Return Charts

##### Bar Chart
This code creates an interactive bar chart using Chart.js to visualize the annual return percentages of the S&P 500 index from the years 1976 to 2025. The chart is displayed on a webpage with responsive design for different screen sizes. The bar chart represents each year's return, and the data is visually presented with bars that are colored in a soft teal, making the information easily interpretable.
The code is written in HTML and JavaScript, with styling applied through internal CSS to enhance the presentation of the chart on the webpage.
##### Candlestick Line Chart
Using Plotly to visualize stock data from 2010 to 2025.
-   The data array contains stock data for each year (from 2010 to 2025). Each entry in the array is an object with date, open, high, low, and close prices for the stock on that specific date.
-   Mapping Data: The map function extracts the values of date, open, high, low, and close from the data array, creating individual arrays for each value.

This code can be used for financial analysis, where the candlestick chart helps visualize trends, price volatility, and market patterns over time

### Sector tab

#### Pie Charts

##### Pie Graph showing the sectors based on company count 
The company count by sector pie graph displays the number of companies in each sector of the S&P 500 index. 
##### Pie Graph showing sectors based on market capitalization 
The Market Capitalization by sector pie graph shows the total market value of all companies in each sector, highlighting which industries dominate the market. 
To use the Market Capitalization pie graph, hover over a sector to see a tooltip with its name and value, click on a sector to display an alert with more details and compare sector sizes to understand the distribution of companies and market capitalization.
The graphs help visualize the dominance and diversity of different industries in the stock market.

### Industry tab 

### Heatmap
This heatmap visualization represents the performance of SP500 companies across different sectors and industries. Each sector is grouped into its corresponding industries, with individual companies represented as rectangles.
Each rectangle contains the symbol of the company and percent change in the company’s stock price.
And also the size of each rectangle is dynamically adjusted based on the value of the percent change. 
Due to the high number of industries and companies, some rectangles may not clearly display their data. To improve usability, tooltips are implemented.
Green: presents the positive percent change in performance which is indicating growth.
Red: presents the negative percent change, which is representing a decline.
To be able to present green and red in the data, the ternary operator in JavaScript was used to dynamically set the background-color as property in CSS.
The heatmap visualization allows users to filter and view specific subsets of companies based on their percent change, they can view also top 10 companies and the last 10 companies.
And also the Users can view which sector has a high performance than the others for example entrainment sector was much better than residential construction sector, the day we collected the dataset.

### Component tab

The purpose of the components tab is to breakdown and analyze the components of the S&P500.

### Scatter Plot
The first visualization is a scatter plot that visualizes the weight distribution of companies in the S&P 500 index. 
The data is processed to create a scatter plot using Plotly.js, showing the relationship between the number of companies and their cumulative weight in the S&P 500, where the x-axis is the number of companies and y-axis is the cumulative weight as a percentage. 
It incorporates some interactive hover tooltips so one can move across the graph and see exactly the number of companies and percentage.  
From the results one can clearly notice that certain companies impact the index much more than others, which could pose a risk if some of the large companies were to drop. 
For example, the top 10 companies out of 500 which is only 2% make up 40% of the market capitalization of the S&P500.

### Dropdown
The second visualization is an interactive dropdown menu for selecting and displaying company information. 
This helps to understand individual components or companies that make up the index. When a company is selected from the dropdown, it triggers a function to fetch and display that company's information from our database. It then displays descriptive information like company name, location, sector, etc. 
The visualization also intentionally incudes a search feature to filter the dropdown options because of the long list of companies, this makes it efficient to just type the name of a specific company one may be interested in further analyzing.

### Small Multiples Chart
The third visualization is an interactive company comparison tool. Where the previous tool gave you descriptive data about each company, this is specifically showing financial metrics.
The first three metrics which include the market cap, net income and revenues are sourced from our database.
The stock price is sourced from alpha vantage API to ensure live updates. 
One will have to get an API key to ensure this works appropriately.

### Bar Graph
The final graph on the components tab creates an interactive chart displaying the top 5 companies based on selected metrics and sectors. 
There are two dropdowns, one populates with sector options and the other with metrics. As such, the chart will dynamically update when you select a certain metric or sector. 
This way, one can easily see what the top companies based on specific metrics are in a specific sector. Based on the analysis, it is clear the technology companies lead the charge in market cap. Interestingly NVIDIA has the largest market cap, but not necessarily the largest revenues. However, there is a saying follow where the money is going not where the money is. 
And in line with that, when you analyze revenue growth over the last year, NVIDIA is back up top.

### Revenue tab 

#### Bubble chart
Bubble chart visualization represents the revenue growth, net income based on the market capitalization of various sectors. 
The chart visualizes the company data based on the sectors they belong to Revenue growth on the x-axis, Net income on the y-axis, bubble and its size denotes the sector and its capital percentage respectively. 
The sectors can be filtered by selecting or deselecting each of the sector in the legends.

### Location tab
#### GeoJSON map
The objective of this visualization is to provide an interactive map of S&P 500 companies that allows users to explore the geographical distribution of these companies across different sectors. 
The map includes location markers and a heatmap to visualize density, helping users identify key business hubs and trends across industries.

## Future work

Here are some future improvements for this project:

- Add more charts such as  choropleths, time-series visualizations,...
- Incorporate real-time data from external APIs  in each tab to keep the dashboard updated dynamically.
- To implement the project on mobile and tablet devices for improving usability.
- Automate the deployment process to support hosting on multiple platforms, such as Heroku or AWS.

Suggestions and contributions are welcome!

