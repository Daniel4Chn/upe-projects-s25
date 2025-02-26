from flask import Flask, render_template, request, jsonify
from geopy.geocoders import Nominatim
from Station import Station
import requests
import certifi, ssl # Ensures usage of updated CA certificates for SSL connections with requests
import os

app = Flask(__name__)
API_KEY = os.getenv('MBTA_API_KEY')
URL = f"https://api-v3.mbta.com/stops?filter[route]=Green-B&api_key={API_KEY}"
OPEN_MAP_URL = url = "https://nominatim.openstreetmap.org/reverse?lat=42.3489153&lon=-71.1009455&format=json&addressdetails=1"

# Creates a custom SSL context using certifi
SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())
geolocator = Nominatim(user_agent="boston_transit_tracker", ssl_context=SSL_CONTEXT)

# Stores a list of Station objects representing each stop on the Green Line
stations = []
first_call = True


@app.before_request
def startup():
    global first_call

    if first_call:
        get_green_line_stops()
        first_call = False
    else:
        pass


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
    



def get_green_line_stops():
    global stations

    try:
        # Ensure usage of certifi for SSL Verification
        response = requests.get(URL, verify=certifi.where())
        response.raise_for_status() # Raises error for bad reponse (4xx or 5xx range)
        stops = response.json()

        for stop in stops['data']:
            stations.append(Station(stop['attributes']['name'],
                                    stop['attributes']['latitude'],
                                    stop['attributes']['longitude']))

        if len(stations) == 0:
            raise requests.exceptions.RequestException
        
        first_call = False

    except requests.exceptions.RequestException as e:
        print(f"Error: Recevied status code {response.status_code} from MBTA API")
        return jsonify({ "status": "error", "message": "Failed to retrieve stops"}), 500




if __name__ == '__main__':
    app.run(debug=True)

##########################
# STARTUP INSTRUCTIONS:
# Run Flask webserver with "flask run", and then navigate to http://<ip address>:5000,
# For remote access, run "ngrok http 5000" to securely expose the local server to the internet