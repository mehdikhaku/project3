from flask import Flask, render_template, jsonify, request
import psycopg2
from psycopg2 import sql

app = Flask(__name__)

# Database connection configuration
db_config = {
    "dbname": "sp500_analysis",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    try:
        conn = psycopg2.connect(**db_config)
        return conn
    except Exception as e:
        print("Error connecting to the database:", e)
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/component')
def component():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT symbol, company_name FROM stock_list;')
        companies = cursor.fetchall()
        cursor.close()
        conn.close()
        companies_list = [{"Symbol": row[0], "Company Name": row[1]} for row in companies]
        return render_template('component.html', companies=companies_list)
    else:
        return "Error connecting to the database", 500

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
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
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
            data = [{"company_count": row[0], "cumulative_weight": row[1]} for row in results]
            return jsonify(data)
        else:
            return jsonify({"error": "Error connecting to the database"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/top_companies')
def top_companies():
    try:
        metric = request.args.get('metric', 'market_cap')
        sector = request.args.get('sector', 'All')
        allowed_metrics = ['market_cap', 'revenues', 'revenue_growth', 'net_income']
        if metric not in allowed_metrics:
            return jsonify({"error": "Invalid metric"}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()
        
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
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        if not results:
            return jsonify([]), 200

        data = [{"company": row[0], "value": row[1]} for row in results]
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies')
def get_companies():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('SELECT symbol, name, sector, city, state, latitude, longitude FROM latitude_longitude;')
        companies = cursor.fetchall()
        cursor.close()
        conn.close()

        companies_list = [
            {
                "symbol": row[0],
                "name": row[1],
                "sector": row[2],
                "city": row[3],
                "state": row[4],
                "latitude": row[5],
                "longitude": row[6]
            } for row in companies
        ]
        return jsonify(companies_list)
    else:
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/heatmap-data')  # New route for heatmap data
def heatmap_data():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        # Query to get data for the heatmap. Adjust as needed.
        cursor.execute("""
            SELECT 
                s.sector,
                s.industry,
                s.symbol,
                s.percent_change
            FROM stock_list s;
        """)  # Example query
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        # Structure the data for the heatmap (nested JSON)
        heatmap_data = {}
        for row in data:
            sector = row[0]
            industry = row[1]
            symbol = row[2]
            percent_change = row[3]

            if sector not in heatmap_data:
                heatmap_data[sector] = {}
            if industry not in heatmap_data[sector]:
                heatmap_data[sector][industry] = []
            heatmap_data[sector][industry].append({"symbol": symbol, "percent_change": percent_change})

        return jsonify(heatmap_data)
    else:
        return "Error connecting to the database", 500


if __name__ == '__main__':
    app.run(debug=True)
