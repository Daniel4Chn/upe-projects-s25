from flask import Flask, render_template, request, jsonify, abort
# from geopy.geocoders import Nominatim
# import certifi, ssl # Ensures usage of updated CA certificates for SSL connections with requests
from Station import Station
from datetime import datetime, timezone
import geopy.distance
import requests
import logging
import json
import os

app = Flask(__name__)
nearest_station_id = None
API_KEY = os.getenv('MBTA_API_KEY')
URL_STOPS = f"https://api-v3.mbta.com/stops?filter[route]=Green-B&api_key={API_KEY}"
DATA_FILE = 'waittime_data.json'
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
        
        log_rate_limits_mbta()
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
        abort(400, description="Failed to retrieve latitude and/or longitude")
    
    '''
    for station in stations:
        print(f"Distance from {station.getName()}: {round(get_station_distance(latitude, longitude, station), 2)} meters")
    '''

    logging.info(f"Retrieved location at {latitude}, {longitude} - Accuracy: within {data.get('accuracy')} meters")

    return jsonify({ "status": "success", "message": (latitude, longitude)}), 200
    
    

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

        return jsonify({ "status": "success", "message": (min_distance, nearest_station.getName()) }), 200
        
    except Exception as e:

        logging.error("Failed to retrieve nearest station")
        abort(500, description=f"Failed to retrieve nearest station: {e}")



@app.route('/update_next_train_prediction', methods=['POST'])
def get_next_train():
    vehicle_id = None
    direction_id = None

    data = request.json
    direction = data.get('direction')
    
    try:
        if API_KEY is None:
            raise ReferenceError
        
        if str(direction).lower() == "westbound":
            direction_id = 0
        elif str(direction).lower() == "eastbound":
            direction_id = 1
        else:
            abort(400, description="Invalid direction parameter: must be 'westbound' or 'eastbound'")

        response = requests.get(f"https://api-v3.mbta.com/predictions?filter[stop]={nearest_station_id}&filter[route]=Green-B&filter[direction_id]={direction_id}&sort=arrival_time&api_key={API_KEY}")
        response.raise_for_status()

        predictions = response.json()['data']
        logging.info(f"Retrieved {len(predictions)} predictions for {nearest_station_id}")

        for prediction in predictions:
            if('relationships' in prediction and
               'vehicle' in prediction['relationships'] and
               prediction['relationships']['vehicle']['data']):
            
                vehicle_id = prediction['relationships']['vehicle']['data']['id']
                train_station = get_station_from_train(vehicle_id)

                if train_station:
                    stops = get_stops_between_stations(train_station, nearest_station_id)
                    return jsonify({ "status": "success", "message": stops }), 200

        abort(404, description="No approaching trains found")
    
    except requests.exceptions.RequestException as request_error:
        logging.error(f"Recevied status code {response.status_code} from MBTA API")
        abort(500, description="Failed to retrieve train predictions")
    except ReferenceError as re:
        logging.error("Failed to retrieve MBTA_API_KEY environmental variable")
        abort(500, description="Failed to retrieve API key from local machine")

    except TypeError as te:
        logging.error("Failed to retrieve train locations: trains are offline")
        abort(503, description="Trains offline")

    except ValueError as ve:
        logging.error("Input an invalid direction when calling the function")
        abort(400, description="Posted invalid parameters for the function to handle")

    except Exception as e:
        logging.error(f"Failed to retrieve train predictions: {type(e).__name__}: {e}")
        abort(500, description="An unknown error occurred when fetching train predictions")





if __name__ == '__main__':
    app.run(debug=True)


### Helper methods below ###

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
        logging.error(f"An unknown error occurred: {type(e).__name__}: {e}")



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
        logging.error(f"Passed incompatible Type: Type must be of Station class: {type(e).__name__}: {e}")



# Retrieves the corresponding station a train is at
def get_station_from_train(vehicle_id):
   
    stop_id = None
    parent_id = None
    trip_id = None
    
    logging.info(f"Referencing train - {vehicle_id}")

    try:
        response = requests.get(f"https://api-v3.mbta.com/vehicles/{vehicle_id}?api_key={API_KEY}")
        response.raise_for_status()

        data = response.json()['data']
        attributes = data.get('attributes', {})
        current_status = attributes.get('current_status')

        logging.debug(f"Vehicle data - {data['type']}")
        logging.info(f"Train status: {current_status}")

        # Direct stop relationship
        if('relationships' in data and
           'stop' in data['relationships'] and
           'data' in data['relationships']['stop'] and
           data['relationships']['stop']['data']):
            
            stop_id = data['relationships']['stop']['data']['id'] # child stop id of current station: convert to parent

           # stop_id is already a parent station, returns
            if stop_id.startswith('place-'):
                return stop_id
            

            # Retrieving parent station from child stop id
            parent_station_response = requests.get(f"https://api-v3.mbta.com/stops/{stop_id}?api_key={API_KEY}")
            parent_station_response.raise_for_status()

            parent_data = parent_station_response.json()['data']

            if('relationships' in parent_data and
               'parent_station' in parent_data['relationships'] and
               'data' in parent_data['relationships']['parent_station'] and
               parent_data['relationships']['parent_station']['data']):
                
                parent_id = parent_data['relationships']['parent_station']['data']['id']
                logging.info(f"Converted stop ID {stop_id} to parent station ID {parent_id}")
                return parent_id

        # Trip data with next stop
        if('relationships' in data and
           'trip' in data['relationships'] and
           'data' in data['relationships']['trip'] and 
           data['relationships']['trip']['data']):
            
            trip_id = data['relationships']['trip']['data']['id']
            route = "Green-B"
            direction_id = attributes.get('direction_id')


            # Getting the stops along the trip
            trip_response = requests.get(f"https://api-v3.mbta.com/trips/{trip_id}/stops?api_key={API_KEY}")
            trip_response.raise_for_status()

            trip_data = trip_response.json()
            if 'data' in trip_data and len(trip_data['data']) > 0:
                current_sequence = attributes.get('current_stop_sequence', 0)
                next_sequence = current_sequence + 1

                for stop in trip_data['data']:
                    if stop['attributes']['stop_sequence'] == next_sequence:
                        return stop['relationships']['stop']['data']['id'] # stop_id of next station
        

        logging.error("Could not determine the current or nearest stop for vehicle")
        return None


    except requests.exceptions.RequestException as request_error:
        if hasattr(request_error, 'response') and request_error.response is not None:
            status_code = request_error.response.status_code
        else:
            status_code = "unknown"

        logging.error(f"Received status code {status_code} from MBTA API")
        return None

    except ReferenceError as re:
        logging.error("Failed to retrieve MBTA_API_KEY environmental variable")
        return None
    
    except Exception as e:
        logging.error(f"An unknown error occurred when retrieving current train location: {type(e).__name__}: {e}")
        return None




# Returns the number of stops between stations
def get_stops_between_stations(station_one, station_two):
    
    station_one_number = None
    station_two_number = None

    # Finding the value of station one
    for i in range(len(stations)):
        if stations[i].getID() == station_one:
            station_one_number = i
            break

    # Finding the value of station two
    for j in range(len(stations)):
        if stations[j].getID() == station_two:
            station_two_number = j
            break


    return abs(station_one_number - station_two_number)



# Retrieve rate limits and rate reset
def log_rate_limits_mbta():

    response = requests.get(f"https://api-v3.mbta.com/routes?api_key={API_KEY}")

    logging.info(f"MBTA - Rate Limit Remaining: {response.headers.get('x-ratelimit-remaining')}")

    try:
        raw_reset_time = (int)(response.headers.get('x-ratelimit-reset'))

        if raw_reset_time:
            logging.info(f"MBTA - Rate Limit Resets at: {datetime.fromtimestamp(raw_reset_time, timezone.utc).strftime('%Y-%m-%d %H:%M:%S %Z')}")
        else:
            logging.info(f"MBTA - Rate Limit Resets at: {raw_reset_time}")

    except Exception as e:
        logging.error(f"Error processing rate limit headers: {type(e).__name__}: {e}")



# Load stored wait time data
def load_data():

    if(os.path.exists(DATA_FILE)):
        with open(DATA_FILE, 'r') as data:
            try:
                return json.load(data)
            
            except json.JSONDecodeError:
                return {"cumulative_waittime": 0}
    
    return {"cumulative_waittime": 0}
    


# Save data to DATA_FILE function
def save_data(data):
    with open(DATA_FILE, 'w') as data_file:
        json.dump(data, data_file)



# Route to flask: post time
@app.route('/update_cumulative_time', methods=['POST'])
def update_cumulative_time():
    data = load_data()
    new_time = request.json.get('time', 0)
    data['cumulative_waittime'] = new_time
    save_data(data)
    
    return jsonify({ "status": "success" }), 200



# Route to flask: get time
@app.route('/get_cumulative_time')
def get_cumulative_time():
    data = load_data()

    return jsonify({ "time": data["cumulative_waittime"] }), 200







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