from flask import Flask, render_template, jsonify
import psycopg2
from psycopg2 import sql

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

@app.route('/api/weight_distribution')
def weight_distribution():
    """API route to calculate and return cumulative weight distribution."""
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            # Updated query to use cap_percentage instead of weight_in_index
            query = """
            SELECT 
                ROW_NUMBER() OVER (ORDER BY cap_percentage DESC) AS company_count,
                SUM(cap_percentage) OVER (ORDER BY cap_percentage DESC) AS cumulative_weight
            FROM stock_list;
            """
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            conn.close()

            # Format data as JSON
            data = [{"company_count": row[0], "cumulative_weight": row[1]} for row in results]
            print(f"Data retrieved: {len(data)} rows")  # Debug print
            return jsonify(data)
        else:
            print("Error: Failed to connect to the database")  # Debug print
            return jsonify({"error": "Error connecting to the database"}), 500
    except Exception as e:
        print(f"An error occurred: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500

from flask import request, jsonify
from psycopg2 import sql

@app.route('/api/sectors')
def get_sectors():
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT sector FROM stock_list ORDER BY sector")
            sectors = [row[0] for row in cursor.fetchall()]
            cursor.close()
            conn.close()
            print(f"Sectors found: {sectors}")  # Debug print
            return jsonify(sectors)
        else:
            print("Database connection failed")
            return jsonify({"error": "Database connection failed"}), 500
    except Exception as e:
        print(f"Error in get_sectors: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/top_companies')
def top_companies():
    try:
        # Get query parameters with defaults
        metric = request.args.get('metric', 'market_cap')
        sector = request.args.get('sector', 'All')

        # Validate allowed metrics
        allowed_metrics = ['market_cap', 'revenues', 'revenue_growth', 'net_income']
        if metric not in allowed_metrics:
            return jsonify({"error": "Invalid metric"}), 400

        # Establish database connection
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()
        
        # Construct SQL query dynamically based on sector and metric
        if sector == 'All':
            query = sql.SQL("""
            SELECT company_name, {}
            FROM stock_list 
            ORDER BY {} DESC 
            LIMIT 5
            """).format(sql.Identifier(metric), sql.Identifier(metric))
            cursor.execute(query)
        else:
            query = sql.SQL("""
            SELECT company_name, {}
            FROM stock_list 
            WHERE sector = %s
            ORDER BY {} DESC 
            LIMIT 5
            """).format(sql.Identifier(metric), sql.Identifier(metric))
            cursor.execute(query, (sector,))
        
        # Fetch results and close connection
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        # Check if results are empty
        if not results:
            return jsonify([]), 200

        # Format results as JSON array
        data = [{"company": row[0], "value": row[1]} for row in results]
        return jsonify(data)

    except Exception as e:
        print(f"Error in top_companies: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies')
def get_companies():
    symbols = request.args.get('symbols').split(',')
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        placeholders = ','.join(['%s'] * len(symbols))
        query = f"SELECT symbol, market_cap, revenues, net_income FROM stock_list WHERE symbol IN ({placeholders})"
        cursor.execute(query, symbols)
        companies = [dict(zip(['symbol', 'market_cap', 'revenues', 'net_income'], row)) for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify(companies)
    else:
        return jsonify({"error": "Database connection failed"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
