from flask import Flask, render_template, request, jsonify
from geopy.geocoders import Nominatim
import time, math

app = Flask(__name__)
geolocator = Nominatim(user_agent="boston_transit_tracker")


@app.route('/')
def index():
    return render_template('index.html')


# Called upon successful callback
@app.route('/update_location', methods=['POST'])
def update_location():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    print(f"Accuracy: Within {data.get('accuracy')} meters")

    return get_address(latitude, longitude)



# Retrieves location from obtained longitude and latitude
@app.route('/get_address', methods=['POST'])
def get_address(lat, lon):
    if lat is None or lon is None:
        return jsonify({ "status": "error", "message": "Missing latitude or longitude"}), 400

    try:
        # Retrieves address from latitude and longitude
        location = geolocator.reverse((lat, lon), exactly_one=True)

        if location:
            address = location.address
            return jsonify({ "status": "success", "message": address})
        else:
            return jsonify({ "status": "error", "message": "Could not locate address" }), 404
    
    except Exception as e:
        return jsonify({ "status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

##########################
# STARTUP INSTRUCTIONS:
# Run Flask webserver with "flask run", and then navigate to http://<ip address>:5000,
# For remote access, run "ngrok http 5000" to securely expose the local server to the internet