from flask import Blueprint, request, jsonify
from db import get_chats

history_bp = Blueprint("history", __name__)

@history_bp.route("/api/chathistory", methods=["GET"])
def chathistory():
    try:
        limit = int(request.args.get("limit", 20))
        rows = get_chats(limit)
        chats = [
            {
                "id": r[0],
                "username": r[1],
                "question": r[2],
                "response": r[3],
                "timestamp": r[4],
            }
            for r in rows
        ]
        return jsonify({"success": True, "data": chats})
    except Exception as e:
        return jsonify({"success": False, "error": "Failed to fetch chat history"}), 500