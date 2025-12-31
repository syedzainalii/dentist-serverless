import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="dentist_db",
        user="postgres",
        password="postgres"
    )
    print("✅ Database connection successful!")
    
    # Test if we can query
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"✅ PostgreSQL version: {version[0]}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Connection failed: {e}")