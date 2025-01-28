from flask import Flask, render_template, jsonify
import psycopg2

app = Flask(__name__)

# Database connection configuration
db_config = {
    "dbname": "sp500_analysis",
    "user": "postgres",  # Replace with your PostgreSQL username
    "password": "postgres",  # Replace with your PostgreSQL password
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**db_config)
        return conn
    except Exception as e:
        print("Error connecting to the database:", e)
        return None

@app.route('/')
def home():
    """Home route."""
    return render_template('index.html')

@app.route('/component')
def component():
    """Dropdown menu for company symbols and names."""
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT symbol, company_name FROM stock_list;')
        companies = cursor.fetchall()
        cursor.close()
        conn.close()

        # Format data for dropdown
        companies_list = [{"Symbol": row[0], "Company Name": row[1]} for row in companies]
        return render_template('component.html', companies=companies_list)
    else:
        return "Error connecting to the database", 500

@app.route('/sector')
def sector():
    """Sector analysis route."""
    return render_template('sector.html')

@app.route('/about')
def about():
    """About page route."""
    return render_template('about.html')

@app.route('/location')
def location():
    """Location page route."""
    return render_template('location.html')

@app.route('/api/dropdown/<symbol>')
def dropdown_data(symbol):
    """API route to retrieve data for a selected company by its symbol."""
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM stock_list WHERE symbol = %s;', (symbol,))
        company = cursor.fetchone()
        cursor.close()
        conn.close()

        if company:
            company_data = {
                "Number": company[0],
                "Symbol": company[1],
                "Company Name": company[2],
                "Market Cap": company[3],
                "Cap Percentage": company[4],
                "Stock Price": company[5],
                "Percent Change": company[6],
                "Revenues": company[7],
                "Volume": company[8],
                "Industry": company[9],
                "Sector": company[10],
                "Rev. Growth": company[11],
                "FCF": company[12],
                "Net Income": company[13],
                "Net Cash": company[14],
                "City": company[15],
                "State": company[16],
                "Country": company[17],
                "Fulltime Employees": company[18],
                "Business Summary": company[19]
            }
            return jsonify(company_data)
        else:
            return jsonify({"error": "Company not found"}), 404
    else:
        return "Error connecting to the database", 500

@app.route('/api/heatmap-data')
def heatmap_data():
    """API route to retrieve sector heatmap data."""
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT sector, SUM(cap_percentage) FROM stock_list GROUP BY sector;')
        sectors = cursor.fetchall()
        cursor.close()
        conn.close()

        # Format data for JSON response
        heatmap_data = {row[0]: row[1] for row in sectors}
        return jsonify(heatmap_data)
    else:
        return "Error connecting to the database", 500

@app.route('/api/graph-data')
def graph_data():
    """API route to retrieve graph data for analysis."""
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT company_name, cap_percentage FROM stock_list;')
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        # Format data for JSON response
        graph_data = {
            "x": [row[0] for row in data],
            "y": [row[1] for row in data]
        }
        return jsonify(graph_data)
    else:
        return "Error connecting to the database", 500

@app.route('/api/scatter-data')
def scatter_data():
    """API route to retrieve scatter plot data."""
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

if __name__ == '__main__':
    app.run(debug=True)
