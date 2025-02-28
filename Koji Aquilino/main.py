from flask import Flask, render_template, request, jsonify
# from geopy.geocoders import Nominatim
# import certifi, ssl # Ensures usage of updated CA certificates for SSL connections with requests
from Station import Station
import geopy.distance
import requests
import logging

import os

app = Flask(__name__)
nearest_station_id = None
API_KEY = os.getenv('MBTA_API_KEY')
URL_STOPS = f"https://api-v3.mbta.com/stops?filter[route]=Green-B&api_key={API_KEY}"
# OPEN_MAP_URL = "https://nominatim.openstreetmap.org/reverse?lat=42.3489153&lon=-71.1009455&format=json&addressdetails=1"

# Creates a custom SSL context using certifi - used to geolocate address from coordinates
# SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())
# geolocator = Nominatim(user_agent="boston_transit_tracker", ssl_context=SSL_CONTEXT)



# Stores a list of Station objects representing each stop on the Green Line
stations = []
first_call = True

# Saves current location of user in latitude and longitude
latitude = None
longitude = None



# Initial calls
@app.before_request
def startup():
    global first_call

    if first_call:

        # Resets logging file
        try:
            open('app_status.log', 'w').close()
        except Exception as e:
            pass
        logging.basicConfig(filename='app_status.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

        get_green_line_stops()
        first_call = False

    else:
        pass



@app.route('/')
def index():
    return render_template('index.html')



# Called upon successful callback
# Updates the user's current location
@app.route('/update_location', methods=['POST'])
def update_location():
    global latitude, longitude

    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    # Returns status code 400 if failed to retrieve location, or received empty data
    if latitude is None or longitude is None:
        return jsonify({ "status": "error", "message": "Failed to retrieve latitude and/or longitude"}), 400
    
    '''
    for station in stations:
        print(f"Distance from {station.getName()}: {round(get_station_distance(latitude, longitude, station), 2)} meters")
    '''

    logging.info(f"Retrieved location at {latitude}, {longitude} - Accuracy: within {data.get('accuracy')} meters")

    return jsonify({ "status": "success", "message": (latitude, longitude)})
    


# Retrieves all the stations along Green Line B from the MBTA API.
def get_green_line_stops():
    global stations

    try:
        # Ensures valid API key
        if API_KEY is None:
            raise ReferenceError

        response = requests.get(URL_STOPS)
        response.raise_for_status() # Raises error for bad reponse (4xx or 5xx range)
        stops = response.json()

        for stop in stops['data']:
            stations.append(Station(stop['attributes']['name'],
                                    stop['attributes']['latitude'],
                                    stop['attributes']['longitude'],
                                    stop['id']))

        if len(stations) == 0:
            raise requests.exceptions.RequestException
        
        first_call = False

    except requests.exceptions.RequestException as request_error:
        logging.error(f"Recevied status code {response.status_code} from MBTA API")
        return jsonify({ "status": "error", "message": "Failed to retrieve stops"}), 500
    
    except ReferenceError as ref_error:
        logging.error(f"MBTA_API_KEY is an empty environmental variable")
        return jsonify({ "status": "error", "message": "Failed to retrieve MBTA API key"}), 500
    
    except Exception as e:
        logging.error(f"An unknown error occurred: {e}")


# Calculates the distance between the current coordinates and a station's coordinates.
# Returns the distance in meters
def get_station_distance(lat, long, station):

    try:
        if type(station) is not Station:
            raise TypeError

        coords_1 = (lat, long)
        coords_2 = (station.getLatitude(), station.getLongitude())

        return geopy.distance.geodesic(coords_1, coords_2).km * 1000
    
    except TypeError as e:
        logging.error(f"Passed incompatible Type: Type must be of Station class: {e}")



# Gets and sends the nearest station to the user's current location to the frontend
@app.route('/update_nearest_station')
def get_nearest_station():
    global nearest_station_id

    try:
        min_distance = get_station_distance(latitude, longitude, stations[0])
        nearest_station = stations[0]

        for i in range(1, len(stations)):
            current_station_distance = get_station_distance(latitude, longitude, stations[i])

            if current_station_distance < min_distance:
                min_distance = current_station_distance
                nearest_station = stations[i]
                nearest_station_id = nearest_station.getID()

        logging.info(f"Retrieved nearest station - {nearest_station.getID()}: {nearest_station.getName()} at {min_distance} meters away")

        return jsonify({ "status": "success", "message": (min_distance, nearest_station.getName()) })
   
    except Exception as e:

        logging.error("Failed to retrieve nearest station")
        return jsonify({ "status": "error", "message": "failed to retrieve nearest station" })



@app.route('/update_next_train_prediction')
def get_next_train():

    vehicle_id = None
    
    try:
        if API_KEY is None:
            raise ReferenceError

        response = requests.get(f"https://api-v3.mbta.com/predictions?filter[stop]={nearest_station_id}&sort=departure_time&include=vehicle&api_key={API_KEY}")
        response.raise_for_status()
        vehicle_id_data = response.json()

        print(vehicle_id_data)


        return jsonify({ "status": "success", "message": vehicle_id_data }), 200
    
    except requests.exceptions.RequestException as request_error:
        logging.error(f"Recevied status code {response.status_code} from MBTA API")
        return jsonify({ "status": "error", "message": "Failed to retrieve train predictions"}), 500

    except ReferenceError as re:
        logging.error("Failed to retrieve MBTA_API_KEY environmental variable")
        return jsonify({ "status": "error", "message": "Failed to retrieve API key from local machine"}), 500
    
    except Exception as e:
        logging.error(f"Failed to retrieve train predictions: {e}")
        return jsonify({ "status": "error", "message": "An unknown error occurred when fetching train predictions" }), 500





if __name__ == '__main__':
    app.run(debug=True)

##########################
# STARTUP INSTRUCTIONS:
# Run Flask webserver with "flask run", and then navigate to http://<ip address>:5001,
# For remote access, run "ngrok http --url=relevant-dashing-porpoise.ngrok-free.app 5001" to securely expose the local server to the internet




'''
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
'''