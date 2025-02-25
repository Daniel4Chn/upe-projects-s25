from flask import Flask, render_template, request, jsonify
import time, math

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


# Called upon successful callback
@app.route('/update_location', methods=['POST'])
def update_location():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    print(f"Latitude: {latitude}, Longitude: {longitude}")

    return jsonify({ 'status': 'success', "message": "Location received." })



##########################
# STARTUP INSTRUCTIONS:
# Run Flask webserver with "flask run --host=0.0.0.0 --port=5000", and then navigate to http://<ip address>:5001