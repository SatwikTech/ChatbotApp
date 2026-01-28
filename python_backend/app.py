from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from db import init_db
from routes import chat_bp, history_bp

load_dotenv()
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Initialize DB
init_db()

# Register routes
app.register_blueprint(chat_bp)
app.register_blueprint(history_bp)

if __name__ == "__main__":
    import os
    PORT = int(os.getenv("PORT", 3000))
    app.run(host="0.0.0.0", port=PORT, debug=True)