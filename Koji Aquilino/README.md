# Boston T Tracker

## Introduction
This project is a web-based application that tracks the time spent waiting for the Boston T (Green Line) to arrive. It uses real-time geolocation to identify when a user enters a station area, and starts a timer after a brief buffer period (distinguishing between waiting and simply passing). The application interfaces with the MBTA API to retrieve and display upcoming train predictions for eastbound and westbound trains from the nearest station. When the user leaves a station, the waiting time exceeding a configurable threshold is added to a cumulative counter. The backend utilizes Flask for data processing and API communications, supplemented the frontend implementing location tracking, mapping with Leaflet.js, and a UI built with Javascript and Bootstrap styling.


## Technologies Used
- Backend: Flask (Python)
- Frontend: HTML, CSS, JavaScript
- Styling: Bootstrap 5
- Mapping: Leaflet.js
- External API: MBTA API for real-time train data
- Geolocation: HTML5 Geolocation API
- Distance Calculation: Geopy

## Getting Started
### Prerequisites
- Python 3.7+
- MBTA API Key (obtain from MBTA Portal)
- Web browser with geolocation support

## Installation
1. Clone the repository
```
git clone https://github.com/kojiken4/upe-projects-s25.git
```

2. Install dependencies
```
pip install flask geopy requests python-dotenv
```

3. Create a `.env` file in the project root and add your MBTA API key
```
MBTA_API_KEY=your_api_key_here
```

4. Install frontend dependencies
```
npm install
```

### Running the Application
1. Start the Flask server
```
flask run
```

2. Open your browser and navigate to `http://localhost:5000`

3. For remote access, you can use ngrok to securely expose the local server to the internet with a public URL.
```
ngrok http 5000
```
