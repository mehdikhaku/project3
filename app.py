from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

# Load data once
data = pd.read_csv('data/S&P 500 Stock List.csv')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    # Pass company data for dropdown
    companies = data[['Symbol', 'Company Name']].to_dict('records')
    return render_template('analysis.html', companies=companies)

@app.route('/heatmap')
def heatmap():
    return render_template('heatmap.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/graph-data')
def graph_data():
    # Prepare graph data for analysis page
    graph_data = {
        "x": data['Company Name'].tolist(),
        "y": data['Cap Percentage'].tolist()
    }
    return jsonify(graph_data)

@app.route('/api/dropdown/<symbol>')
def dropdown_data(symbol):
    # Find the selected company
    company_info = data[data['Symbol'] == symbol].iloc[0].to_dict()
    return jsonify(company_info)

@app.route('/api/heatmap-data')
def heatmap_data():
    # Prepare sector heatmap data
    sectors = data.groupby('Company Name')['Cap Percentage'].sum()
    return jsonify(sectors.to_dict())

if __name__ == '__main__':
    app.run(debug=True)
