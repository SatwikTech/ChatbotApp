import sqlite3

def init_db():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chathistory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT DEFAULT 'Anonymous',
        question TEXT NOT NULL,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
    conn.close()

def save_chat(username, question, response, timestamp):
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO chathistory (username, question, response, timestamp) VALUES (?, ?, ?, ?)",
        (username, question, response, timestamp)
    )
    conn.commit()
    conn.close()

def get_chats(limit=20):
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, username, question, response, timestamp FROM chathistory ORDER BY timestamp DESC LIMIT ?",
        (limit,)
    )
    rows = cursor.fetchall()
    conn.close()
    return rows[::-1]  # oldest → newest