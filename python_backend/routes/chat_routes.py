from flask import Blueprint, request, jsonify
from datetime import datetime
from db import save_chat
from services.huggingface_service import get_huggingface_response

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json
    username = data.get("username", "Anonymous")
    message = data.get("message")

    if not message or not message.strip():
        return jsonify({"success": False, "error": "Message is required."}), 400

    try:
        response_text = get_huggingface_response(message)
        save_chat(username, message, response_text, datetime.now().isoformat())
        return jsonify({
            "success": True,
            "data": {
                "username": username,
                "question": message,
                "response": response_text,
                "timestamp": datetime.now().isoformat()
            }
        })
    except Exception as e:
        # Always return JSON, even on error
        return jsonify({"success": False, "error": str(e)}), 500