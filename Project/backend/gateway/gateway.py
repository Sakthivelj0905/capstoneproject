from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# ----------------------------
# Backend service URLs
# ----------------------------
AUTH_SERVICE = os.getenv("AUTH_SERVICE", "http://127.0.0.1:5001")   
TRAVEL_SERVICE = os.getenv("TRAVEL_SERVICE", "http://127.0.0.1:5002") 

# ----------------------------
# Auth Routes via Gateway
# ----------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    resp = requests.post(f"{AUTH_SERVICE}/register", json=data)
    return jsonify(resp.json()), resp.status_code

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    resp = requests.post(f"{AUTH_SERVICE}/login", json=data)
    return jsonify(resp.json()), resp.status_code

@app.route("/users", methods=["GET"])
def get_users():
    resp = requests.get(f"{AUTH_SERVICE}/admin/users")
    return jsonify(resp.json()), resp.status_code
# 
@app.route("/users/<int:user_id>/role", methods=["PUT"])
def update_user_role(user_id):
    data = request.json
    resp = requests.put(f"{AUTH_SERVICE}/admin/user/{user_id}/role", json=data)
    return jsonify(resp.json()), resp.status_code

@app.route("/users/<int:user_id>/status", methods=["PUT"])
def update_user_status(user_id):
    data = request.json
    resp = requests.put(f"{AUTH_SERVICE}/admin/user/{user_id}/status", json=data)
    return jsonify(resp.json()), resp.status_code

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    resp = requests.delete(f"{AUTH_SERVICE}/admin/user/{user_id}")
    return jsonify(resp.json()), resp.status_code

@app.route("/admin/register", methods=["POST"])
def register_admin_gateway():
    data = request.json
    try:
        resp = requests.post(f"{AUTH_SERVICE}/admin/register", json=data, timeout=5)
        resp.raise_for_status() 
        try:
            return jsonify(resp.json()), resp.status_code
        except ValueError:
            return resp.text, resp.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to connect to AUTH_SERVICE", "details": str(e)}), 500
# ----------------------------
# Packages Routes via Gateway
# ----------------------------

# Add new package
@app.route("/packages", methods=["POST"])
def add_package():
    data = request.json
    resp = requests.post(f"{TRAVEL_SERVICE}/packages", json=data)
    return jsonify(resp.json()), resp.status_code

# Update existing package
@app.route("/packages/<int:package_id>", methods=["PUT"])
def update_package(package_id):
    data = request.json
    resp = requests.put(f"{TRAVEL_SERVICE}/packages/{package_id}", json=data)
    return jsonify(resp.json()), resp.status_code

# Delete package
@app.route("/packages/<int:package_id>", methods=["DELETE"])
def delete_package(package_id):
    resp = requests.delete(f"{TRAVEL_SERVICE}/packages/{package_id}")
    return jsonify(resp.json()), resp.status_code

@app.route("/packages", methods=["GET"])
def get_packages():
    resp = requests.get(f"{TRAVEL_SERVICE}/packages")
    return jsonify(resp.json()), resp.status_code

@app.route("/packages/<int:package_id>", methods=["GET"])
def get_package(package_id):
    resp = requests.get(f"{TRAVEL_SERVICE}/packages/{package_id}")
    return jsonify(resp.json()), resp.status_code

@app.route("/packages/<int:package_id>", methods=["PATCH"])
def patch_package(package_id):
    data = request.json
    resp = requests.patch(f"{TRAVEL_SERVICE}/packages/{package_id}", json=data)
    return jsonify(resp.json()), resp.status_code


# ----------------------------
# Bookings Routes via Gateway
# ----------------------------
@app.route("/bookings", methods=["POST"])
def add_booking():
    data = request.json
    resp = requests.post(f"{TRAVEL_SERVICE}/bookings", json=data)

    try:
        return jsonify(resp.json()), resp.status_code
    except ValueError:
        return resp.text, resp.status_code


@app.route("/bookings", methods=["GET"])
def get_all_bookings():
    resp = requests.get(f"{TRAVEL_SERVICE}/bookings")
    return jsonify(resp.json()), resp.status_code


@app.route("/bookings/user/<int:user_id>", methods=["GET"])
def get_user_bookings(user_id):
    resp = requests.get(f"{TRAVEL_SERVICE}/bookings/user/{user_id}")
    return jsonify(resp.json()), resp.status_code

@app.route("/bookings/<int:booking_id>", methods=["PUT"])
def update_booking(booking_id):
    data = request.json
    resp = requests.put(f"{TRAVEL_SERVICE}/bookings/{booking_id}", json=data)
    return jsonify(resp.json()), resp.status_code

@app.route("/bookings/<int:booking_id>", methods=["DELETE"])
def delete_booking(booking_id):
    resp = requests.delete(f"{TRAVEL_SERVICE}/bookings/{booking_id}")
    return jsonify(resp.json()), resp.status_code

# Cancel booking
@app.route("/bookings/<int:booking_id>/cancel", methods=["PUT"])
def cancel_booking(booking_id):
    data = request.json if request.is_json else {}
    resp = requests.put(f"{TRAVEL_SERVICE}/bookings/{booking_id}/cancel", json=data)
    return jsonify(resp.json()), resp.status_code



# ----------------------------
# Reviews Routes via Gateway
# ----------------------------
@app.route("/reviews", methods=["GET"])
def get_reviews():
    resp = requests.get(f"{TRAVEL_SERVICE}/reviews")
    return jsonify(resp.json()), resp.status_code

@app.route("/reviews", methods=["POST"])
def add_review():
    data = request.json
    resp = requests.post(f"{TRAVEL_SERVICE}/reviews", json=data)
    return jsonify(resp.json()), resp.status_code

@app.route("/reviews/<int:review_id>", methods=["DELETE"])
def delete_review(review_id):
    resp = requests.delete(f"{TRAVEL_SERVICE}/reviews/{review_id}")
    return jsonify(resp.json()), resp.status_code


# ----------------------------
# Health check
# ----------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Gateway running"}), 200

# ----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
