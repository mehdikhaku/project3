from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

# Load data once
data = pd.read_csv('data/S&P 500 Stock List.csv')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/component')
def component():
    # Pass company data for dropdown
    companies = data[['Symbol', 'Company Name']].to_dict('records')
    return render_template('component.html', companies=companies)

@app.route('/sector')
def sector():
    return render_template('sector.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/location')
def location():
    return render_template('location.html')

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

@app.route('/api/graph-data')
def graph_data():
    # Prepare graph data for analysis page
    graph_data = {
        "x": data['Company Name'].tolist(),
        "y": data['Cap Percentage'].tolist()
    }
    return jsonify(graph_data)

@app.route('/api/scatter-data')
def get_scatter_data():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT 
                rev_growth, net_income, market_cap, sector, symbol 
            FROM stock_list;
        ''')
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        # Format data for JSON response
        scatter_data = [
            {
                'rev_growth': row[0],
                'net_income': row[1],
                'market_cap': row[2],
                'sector': row[3],
                'symbol': row[4]
            }
            for row in data
        ]
        return jsonify(scatter_data)
    else:
        return "Error connecting to the database", 500