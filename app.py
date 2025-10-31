from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend to connect (important)

# Temporary storage (later we’ll use a database)
logs = []

# Test route
@app.route('/')
def home():
    return "PIM/PAM Monitoring Backend Running ✅"

# API to receive user activity logs
@app.route('/log_action', methods=['POST'])
def log_action():
    data = request.get_json()
    log_entry = {
        'user': data.get('user', 'unknown'),
        'action': data.get('action', ''),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    logs.append(log_entry)
    return jsonify({'message': 'Action logged successfully'}), 200

# API to get all logs (for admin)
@app.route('/get_logs', methods=['GET'])
def get_logs():
    return jsonify(logs), 200

if __name__ == '__main__':
    app.run(debug=True)


