from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# SQLite database for authentication
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///auth.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --------------------
# Database Model
# --------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="customer")  
    status = db.Column(db.String(20), nullable=False, default="active")  

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "status": self.status
        }

# Create tables
with app.app_context():
    db.create_all()

# --------------------
# Routes
# --------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    new_user = User(name=name, email=email, password=hashed_password)  
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"error": "Invalid email or password"}), 401

    if user.status == "blocked":
        return jsonify({"error": "User is blocked"}), 403

    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "role": user.role,
        "status": user.status
    })

# --------------------
# Admin Routes
# --------------------
@app.route('/admin/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/admin/user/<int:user_id>/role', methods=['PUT'])
def update_role(user_id):
    data = request.json
    new_role = data.get("role")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.role = new_role
    db.session.commit()
    return jsonify({"message": "User role updated", "user": user.to_dict()})

@app.route('/admin/user/<int:user_id>/status', methods=['PUT'])
def update_status(user_id):
    data = request.json
    new_status = data.get("status")  
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.status = new_status
    db.session.commit()
    return jsonify({"message": "User status updated", "user": user.to_dict()})

@app.route("/admin/register", methods=["POST"])
def register_admin():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    new_user = User(name=name, email=email, password=hashed_password, role="admin")
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Admin registered successfully", "user": new_user.to_dict()}), 201


@app.route('/admin/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"})

# --------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
