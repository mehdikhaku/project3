import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# Database connection details
DB_NAME = "sp500_analysis"
DB_USER = "postgres"
DB_PASSWORD = "postgres"  # Replace with your PostgreSQL password
DB_HOST = "localhost"
DB_PORT = "5432"

# Establish database connection
try:
    conn = psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
    )
    print("Database connection successful.")
except Exception as e:
    print(f"Error: {e}")
    exit()

cursor = conn.cursor()

# Import Historical Returns data
def import_historical_returns():
    df = pd.read_csv("data/Historical Returns S&P 500.csv")
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    
    # Insert data into the database
    sql = """
        INSERT INTO historical_returns (year, avg_closing_price, open_price, high_price, low_price, close_price, annual_percent_change, dividend_return, total_return)
        VALUES %s
    """
    execute_values(cursor, sql, df.values.tolist())
    conn.commit()
    print("Historical Returns data imported successfully.")

# Import Stock List data
def import_stock_list():
    df = pd.read_csv("data/S&P 500 Stock List.csv")
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    
    # Insert data into the database
    sql = """
        INSERT INTO stock_list (symbol, company_name, market_cap, cap_percentage, stock_price, percent_change, revenues, volume, industry, sector, revenue_growth, fcf, net_income, net_cash, city, state, country, fulltime_employees, business_summary)
        VALUES %s
    """
    execute_values(cursor, sql, df.values.tolist())
    conn.commit()
    print("Stock List data imported successfully.")

# Execute the functions
try:
    import_historical_returns()
    import_stock_list()
except Exception as e:
    print(f"Error: {e}")
finally:
    cursor.close()
    conn.close()
