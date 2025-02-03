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

