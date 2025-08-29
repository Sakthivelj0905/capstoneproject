from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# SQLite database for travel info
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --------------------
# Database Models
# --------------------
class Package(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    overview = db.Column(db.Text)
    duration = db.Column(db.Integer)
    slots = db.Column(db.Integer)
    price = db.Column(db.Integer)
    itinerary = db.Column(db.Text)  # JSON string
    vehicles = db.Column(db.Text)   # JSON string
    facilities = db.Column(db.Text)  # JSON string
    description = db.Column(db.Text)
    insights = db.Column(db.Text)
    suggestions = db.Column(db.Text)  # JSON string
    batches = db.Column(db.Text)  # JSON string
    images = db.Column(db.Text)  # JSON string
    instructions = db.Column(db.Text)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    organizer = db.Column(db.String(200))
    travelers = db.Column(db.Text)  
    vehicle = db.Column(db.String(50))
    batch = db.Column(db.String(100))
    package_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)  
    status = db.Column(db.String(50), default="pending")
    has_review = db.Column(db.Boolean, default=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    name = db.Column(db.String(150))
    comment = db.Column(db.Text)
    rating = db.Column(db.Integer)
    image = db.Column(db.String(250))


# Create tables
with app.app_context():
    db.create_all()

# --------------------
# Routes – Packages
# --------------------

@app.route('/packages', methods=['GET'])
def get_packages():
    packages = Package.query.all()
    output = []
    for pkg in packages:
        output.append({
            "id": pkg.id,
            "name": pkg.name,
            "overview": pkg.overview,
            "duration": pkg.duration,
            "slots": pkg.slots,
            "price": pkg.price,
            "itinerary": json.loads(pkg.itinerary),
            "vehicles": json.loads(pkg.vehicles),
            "facilities": json.loads(pkg.facilities),
            "description": pkg.description,
            "insights": pkg.insights,
            "suggestions": json.loads(pkg.suggestions),
            "batches": json.loads(pkg.batches),
            "images": json.loads(pkg.images),
            "instructions": pkg.instructions
        })
    return jsonify(output)


@app.route('/packages/<int:package_id>', methods=['GET'])
def get_package(package_id):
    pkg = Package.query.get(package_id)
    if not pkg:
        return jsonify({"error": "Package not found"}), 404
    return jsonify({
        "id": pkg.id,
        "name": pkg.name,
        "overview": pkg.overview,
        "duration": pkg.duration,
        "slots": pkg.slots,
        "price": pkg.price,
        "itinerary": json.loads(pkg.itinerary),
        "vehicles": json.loads(pkg.vehicles),
        "facilities": json.loads(pkg.facilities),
        "description": pkg.description,
        "insights": pkg.insights,
        "suggestions": json.loads(pkg.suggestions),
        "batches": json.loads(pkg.batches),
        "images": json.loads(pkg.images),
        "instructions": pkg.instructions
    })


@app.route('/packages', methods=['POST'])
def add_package():
    data = request.json
    new_pkg = Package(
        name=data.get("name"),
        overview=data.get("overview"),
        duration=data.get("duration"),
        slots=data.get("slots"),
        price=data.get("price"),
        itinerary=json.dumps(data.get("itinerary", [])),
        vehicles=json.dumps(data.get("vehicles", [])),
        facilities=json.dumps(data.get("facilities", [])),
        description=data.get("description"),
        insights=data.get("insights"),
        suggestions=json.dumps(data.get("suggestions", [])),
        batches=json.dumps(data.get("batches", [])),
        images=json.dumps(data.get("images", [])),
        instructions=data.get("instructions")
    )
    db.session.add(new_pkg)
    db.session.commit()
    return jsonify({"message": "Package added", "package_id": new_pkg.id}), 201


@app.route('/packages/<int:package_id>', methods=['PUT'])
def update_package(package_id):
    pkg = Package.query.get(package_id)
    if not pkg:
        return jsonify({"error": "Package not found"}), 404
    data = request.json
    pkg.name = data.get("name", pkg.name)
    pkg.overview = data.get("overview", pkg.overview)
    pkg.duration = data.get("duration", pkg.duration)
    pkg.slots = data.get("slots", pkg.slots)
    pkg.price = data.get("price", pkg.price)
    pkg.itinerary = json.dumps(data.get("itinerary", json.loads(pkg.itinerary)))
    pkg.vehicles = json.dumps(data.get("vehicles", json.loads(pkg.vehicles)))
    pkg.facilities = json.dumps(data.get("facilities", json.loads(pkg.facilities)))
    pkg.description = data.get("description", pkg.description)
    pkg.insights = data.get("insights", pkg.insights)
    pkg.suggestions = json.dumps(data.get("suggestions", json.loads(pkg.suggestions)))
    pkg.batches = json.dumps(data.get("batches", json.loads(pkg.batches)))
    pkg.images = json.dumps(data.get("images", json.loads(pkg.images)))
    pkg.instructions = data.get("instructions", pkg.instructions)
    db.session.commit()
    return jsonify({"message": "Package updated"})


@app.route('/packages/<int:package_id>', methods=['DELETE'])
def delete_package(package_id):
    pkg = Package.query.get(package_id)
    if not pkg:
        return jsonify({"error": "Package not found"}), 404
    db.session.delete(pkg)
    db.session.commit()
    return jsonify({"message": "Package deleted"})

@app.route('/packages/<int:package_id>', methods=['PATCH'])
def patch_package(package_id):
    pkg = Package.query.get(package_id)
    if not pkg:
        return jsonify({"error": "Package not found"}), 404
    data = request.json
    if "slots" in data:
        pkg.slots = data["slots"]
    db.session.commit()
    return jsonify({"message": "Package slots updated"})


# --------------------
# Routes – Bookings
# --------------------
@app.route('/bookings', methods=['POST'])
def add_booking():
    data = request.json
    travelers = data.get("travelers", [])
    num_travelers = len(travelers)

    pkg = Package.query.get(data.get("package_id"))
    if not pkg:
        return jsonify({"error": "Package not found"}), 404

    status = data.get("status", "pending")
    if status == "confirmed":
        if pkg.slots < num_travelers:
            return jsonify({"error": "Not enough slots available"}), 400
        pkg.slots -= num_travelers 

    # Save booking
    new_booking = Booking(
        organizer=data.get("organizer"),
        travelers=json.dumps(travelers),
        vehicle=data.get("vehicle"),
        batch=data.get("batch"),
        package_id=data.get("package_id"),
        user_id=data.get("user_id"),
        status=status
    )

    try:
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({"message": "Booking added", "booking_id": new_booking.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Booking failed: {str(e)}"}), 500


@app.route('/bookings', methods=['GET'])
def get_all_bookings():
    try:
        bookings = Booking.query.all()

        output = []
        for b in bookings:
            output.append({
                "id": b.id,
                "organizer": b.organizer,
                "travelers": json.loads(b.travelers) if b.travelers else [],
                "vehicle": b.vehicle,
                "batch": b.batch,
                "package_id": b.package_id,
                "user_id": b.user_id,
                "status": b.status
            })

        return jsonify(output), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/bookings/user/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).all()
    output = []
    for b in bookings:
        review_exists = Review.query.filter_by(booking_id=b.id).first() is not None
        output.append({
            "id": b.id,
            "organizer": b.organizer,
            "travelers": json.loads(b.travelers),
            "vehicle": b.vehicle,
            "batch": b.batch,
            "package_id": b.package_id,
            "user_id": b.user_id,
            "status": b.status,
            "hasReview": b.has_review
        })
    return jsonify(output)

@app.route('/bookings/<int:id>', methods=['PUT'])
def update_booking(id):
    data = request.get_json()
    booking = Booking.query.get_or_404(id)

    old_status = booking.status
    new_status = data.get("status", booking.status)

    # Update booking fields
    booking.organizer = data.get("organizer", booking.organizer)
    booking.travelers = json.dumps(data.get("travelers", json.loads(booking.travelers)))
    booking.vehicle = data.get("vehicle", booking.vehicle)
    booking.batch = data.get("batch", booking.batch)   
    booking.package_id = data.get("package_id", booking.package_id)

    # --- SLOT LOGIC ---
    if old_status != new_status:
        pkg = Package.query.get(booking.package_id)
        traveler_count = len(json.loads(booking.travelers))

        # Rule 1: pending → confirmed → reduce slots
        if old_status == "pending" and new_status == "confirmed":
            if pkg.slots >= traveler_count:
                pkg.slots -= traveler_count
            else:
                return jsonify({"error": "Not enough slots available"}), 400

        # Rule 2: cancelled → confirmed → reduce slots
        elif old_status == "cancelled" and new_status == "confirmed":
            if pkg.slots >= traveler_count:
                pkg.slots -= traveler_count
            else:
                return jsonify({"error": "Not enough slots available"}), 400

        # Rule 3: confirmed → pending → restore slots
        elif old_status == "confirmed" and new_status == "pending":
            pkg.slots += traveler_count

        # Rule 4: confirmed → cancelled → restore slots
        elif old_status == "confirmed" and new_status == "cancelled":
            pkg.slots += traveler_count

        # Rule 5: pending → cancelled → no change
        elif old_status == "pending" and new_status == "cancelled":
            pass

    booking.status = new_status

    try:
        db.session.commit()
        return jsonify({
            "message": "Booking updated successfully",
            "booking": {
                "id": booking.id,
                "organizer": booking.organizer,
                "travelers": json.loads(booking.travelers),
                "vehicle": booking.vehicle,
                "batch": booking.batch,
                "package_id": booking.package_id,
                "user_id": booking.user_id,
                "status": booking.status
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/bookings/<int:id>', methods=['DELETE'])
def delete_booking(id):
    booking = Booking.query.get_or_404(id)
    pkg = Package.query.get(booking.package_id)

    traveler_count = len(json.loads(booking.travelers)) if booking.travelers else 0

    if booking.status == "confirmed" and pkg:
        pkg.slots += traveler_count

    try:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"message": "Booking deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/bookings/<int:booking_id>/cancel', methods=['PUT'])
def cancel_booking(booking_id):
    b = Booking.query.get(booking_id)
    if not b:
        return jsonify({"error": "Booking not found"}), 404

    if b.status == "cancelled":
        return jsonify({"message": "Booking already cancelled"}), 400

    pkg = Package.query.get(b.package_id)
    traveler_count = len(json.loads(b.travelers)) if b.travelers else 0

    if b.status == "confirmed" and pkg:
        pkg.slots += traveler_count

    b.status = "cancelled"

    try:
        db.session.commit()
        return jsonify({"message": "Booking cancelled successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# --------------------
# Routes – Reviews
# --------------------

@app.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    output = []
    for r in reviews:
        output.append({
            "id": r.id,
            "booking_id": r.booking_id,
            "user_id": r.user_id,
            "name": r.name,
            "comment": r.comment,
            "rating": r.rating,
            "image": r.image
        })
    return jsonify(output)


@app.route('/reviews', methods=['POST'])
def add_review():
    data = request.json
    booking_id = data.get("booking_id")
    user_id = data.get("user_id")

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    if booking.user_id != user_id:
        return jsonify({"error": "You cannot review this booking"}), 403

    if booking.has_review:
        return jsonify({"error": "This booking already has a review"}), 400

    # Save review
    new_review = Review(
        booking_id=booking_id,
        user_id=user_id,
        name=data.get("name"),
        comment=data.get("comment"),
        rating=data.get("rating"),
        image=data.get("image", "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png")
    )
    db.session.add(new_review)

    # Mark booking as reviewed forever
    booking.has_review = True
    db.session.commit()

    return jsonify({"message": "Review added successfully"}), 201



@app.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({"error": "Review not found"}), 404
    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted"})

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5002, debug=True)
