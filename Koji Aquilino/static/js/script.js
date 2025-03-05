"use strict"

// Time upon entering station that will not count toward the timer
const STATION_PASSING_THRESHOLD = 5000; // milliseconds (if just passing a station while walking)
const MINIMUM_DISTANCE_THRESHOLD = 20; // meters (normal=20m)
const WAITTIME_THRESHOLD = 0; // seconds (normal=180s/3min), adjustable
const TIMEOUT = 5000; // milliseconds (normal=5000ms)
const TIMEOUT_RETRIES = 3; // retries (normal=3)
const DEFAULT_MAP_COORDINATES = [42.3601, -71.0589]; // Boston

let locationEntryTimestamp, timer, timerBuffer, bufferTime;
let nearestStation;
let retries = 0;
let currentWaittime = 0; // seconds
let cumulativeWaittime = 0; // seconds

let map;
let userMarker;
let stationMarkers = [];



 
// Handles API errors
let handleError = (error) => {
    // Check specifically for timeout errors (error.code === 3)
    if (error.code === 3) {
        // Code to execute when geolocation times out
        console.error("Geolocation timed out!");
		retries++;
        
		if(retries < TIMEOUT_RETRIES) {
			// Update UI to notify user
			document.getElementById("station-header").innerText = "Location Service: ";
			document.getElementById("station-status").innerText = "Timed out. Retrying...";
			
			// Retries after a delay
			setTimeout(() => {
				console.log("Retrying geolocation after timeout...");
				trackLocation();
			}, 3000); // Wait 3 seconds before retrying
		}
		else {
			document.getElementById("station-status").innerText = "Could not fetch location data";
		}
    } 
    // Handle other geolocation errors
    else if (error.code === 1) {
        // Permission denied
        document.getElementById("station-header").innerText = "Location Access: ";
        document.getElementById("station-status").innerText = "Permission denied";
    } 
    else if (error.code === 2) {
        // Position unavailable
        document.getElementById("station-header").innerText = "Location Service: ";
        document.getElementById("station-status").innerText = "Currently unavailable";
    }
    else {
        // Generic error handling
        console.error("Error getting location:", error);
    }
};


// initialize a new map for user location
function initMap() {

	const mapContainer = document.getElementById('current-location-map');
	const [DEFAULT_LATITUDE, DEFAULT_LONGITUDE] = DEFAULT_MAP_COORDINATES;

	if (!mapContainer) {
        console.error("Map container element not found!");
        return;
    }

	map = L.map('current-location-map', {
		dragging: false,
		touchZoom: false,
		scrollWheelZoom: false,
		doubleClickZoom: false,
		keyboard: false,
		zoomControl: false
	}).setView([DEFAULT_LATITUDE, DEFAULT_LONGITUDE], 13, {
		animate: true,
		pan: {
			duration: 1
		}
	});

	// Add OpenStreetMap tiles to map: modifiable
	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
		attribution: '© OpenStreetMap contributors, © CARTO'
	}).addTo(map);

	// Create new user marker on the map
	userMarker = L.marker([0, 0], {
		icon: L.divIcon({
			html: '<div style="background-color: blue; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white;"></div>',
            className: 'user-location-marker'
		})
	});

	console.log("success")
}

// Run on successful callback: Sends location to backend
function updateLocation(position) {

 	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	const accuracy = position.coords.accuracy;
	const speed = position.coords.speed || 0; // in m/s

	if(map && userMarker) {
		userMarker.setLatLng([latitude, longitude]).addTo(map);
		map.setView([latitude, longitude], 15, {
			animate: true,
			pan: {
				duration: 1
			}
		})
	}


	fetch("/update_location", {
		method: "POST",
		headers: { "Content-Type": "application/json"}, 
		body: JSON.stringify({ latitude: latitude, longitude: longitude, accuracy: accuracy, speed: speed })
	})
	.then(response => response.json())
	.then(data => {
		
		if(data.status === "success") {
			updateNearestStation()
			.then(() => {

				updateNextTrainPrediction("eastbound");
				updateNextTrainPrediction("westbound");
				retries = 0;
			});
		}
		else {
			throw GeolocationPositionError;
		}

	})
	.catch(error => console.error("Error sending data:", error));
}


// Tracks location with .watchPosition()
function trackLocation() {
	if("geolocation" in navigator) {
		navigator.geolocation.watchPosition(updateLocation, handleError, {
		// navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
			enableHighAccuracy: true, // Precise location data
			maximumAge: 10000, // 10 seconds cached location
			timeout: TIMEOUT
		})
	}
	else {
		alert("Geolocator is not supported by this browser.");
	}
}


// Updates nearest station to user 
// Fetches longitude and latitude of nearest station
async function updateNearestStation() {
	return fetch("/update_nearest_station")
	.then(response => response.json())
	.then(data => {

		nearestStation = data.nearest_station[1];
		
		if(map) {
			
			// Removes previous station markers
			stationMarkers.forEach(marker => map.removeLayer(marker));
			stationMarkers = [];

			// Adds the station marker of the nearest station
			const stationMarker = L.marker([data.station_coordinates[0], data.station_coordinates[1]], {
				icon: L.divIcon({
					html: `<div style="position: relative; width: 18px; height: 18px;">
							  <div style="background-color: green; width: 100%; height: 100%; border-radius: 50%; border: 2px solid white;"></div>
							  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, 20%); color: black; font-size: 12px; font-weight: bold;">${nearestStation}</div>
						   </div>`,
					className: 'station-marker'
				})
			}).addTo(map);

			stationMarker.bindPopup(data.nearest_station[1]);
			stationMarkers.push(stationMarker);
		}

		// If currently at station: starts buffer for if passing,
		// then runs function startTimer()
		if(data.nearest_station[0] <= MINIMUM_DISTANCE_THRESHOLD) {

			// Provides a buffer for when only passing 
			// a station, to not start the timer
			if(!timer && !timerBuffer) {
				locationEntryTimestamp = Date.now();
				startTimerBuffer();

				document.getElementById("station-header").innerText = "Approaching Station: ";
			}

			document.getElementById("station-status").innerText = data.nearest_station[1];
		}

		// Not at station: ends timer and adds time,
		// even if haven't boarded a train
		else {
			stopTimerBuffer();
			stopTimer();

			document.getElementById("station-header").innerText = `${data.nearest_station[1]}: `;
			document.getElementById("station-status").innerText = `${Math.trunc(data.nearest_station[0])} meters away`;
		}
	})
	.catch(error => console.error("Error retrieving station data:", error));
}



// Fetches and updates the nearest train predictions for next arrival
function updateNextTrainPrediction(direction) {
	fetch("/update_next_train_prediction", {
		method: "POST",
		headers: { "Content-Type": "application/json"},
		body: JSON.stringify({ direction: direction })

	})
	.then(response => response.json())
	.then(data => {
		
		if(data.status === "success") {
			update_relevant_train_prediction(direction, data);
		}
		else {
			throw new Error(`HTTP error - status: ${response.status}, message: ${response.statusText}`);
		}
	})
	.catch(error => {
		if (error.status === 503) {
			document.getElementById("nearest-train").innerText = "Trains offline";
			document.getElementById("nearest-train-stops").innerText = "";
		} else {
			console.error("Error retrieving train predictions:", error);
		}
	});
}



// helper method: updates relevant tags for train predictions
function update_relevant_train_prediction(direction, data) {
	if(direction === "eastbound") {
		if(data.message === 0) {
			document.getElementById("eastbound-train").innerText = "Approaching ";
			document.getElementById("eastbound-train-stops").innerText = nearestStation + "...";
		}
		else {
			document.getElementById("eastbound-train").innerText = "";

			if(data.message === 1) {
				document.getElementById("eastbound-train-stops").innerText = data.message + " stop away";
			}
			else {
				document.getElementById("eastbound-train-stops").innerText = data.message + " stops away";
			}
		}
	}

	else if(direction === "westbound") {
		if(data.message === 0) {
			document.getElementById("westbound-train").innerText = "Approaching ";
			document.getElementById("westbound-train-stops").innerText = nearestStation + "...";
		}
		else {
			document.getElementById("westbound-train").innerText = "";

			if(data.message === 1) {
				document.getElementById("westbound-train-stops").innerText = data.message + " stop away";
			}
			else {
				document.getElementById("westbound-train-stops").innerText = data.message + " stops away";
			}
		}
	}

	else {
		throw new TypeError("Parameter must be 'westbound' or 'eastbound', along with passing in the json data from the parent call");
	}
}



// Does not track time when only passing a station:
// calls startTimer() and clears itself once passing the buffer threshold
function startTimerBuffer() {
	if(timerBuffer) {
		clearInterval(timerBuffer);
	}

	locationEntryTimestamp = Date.now();

	timerBuffer = setInterval(() => {
		bufferTime = Date.now() - locationEntryTimestamp;

		if(bufferTime >= STATION_PASSING_THRESHOLD) {
			startTimer();
			stopTimerBuffer();
			document.getElementById("station-header").innerText = "Waiting at: ";
		}
	}, 1000);
}



function stopTimerBuffer() {
	if(timerBuffer) {
		clearInterval(timerBuffer);
		timerBuffer = null;
		bufferTime = 0;
	}
}



// Starts the current wait timer
function startTimer() {
	if(timer) {
		clearInterval(timer);
	}

	let timerStartTimestamp = Date.now() - (currentWaittime * 1000);

	timer = setInterval(() => {
		currentWaittime = Math.floor((Date.now() - timerStartTimestamp) / 1000);
		updateCurrentWaitTimeDisplay();
	}, 1000);
}



// Stops the current wait timer
function stopTimer() {
	if(timer) {
		addTime();
		clearInterval(timer);
		timer = null;
	}
}



// Adds the time to the cumulative time counter
function addTime() {
	cumulativeWaittime += currentWaittime - WAITTIME_THRESHOLD;
	currentWaittime = 0;

	localStorage.setItem('cumulative_waittime', cumulativeWaittime);

	fetch('/update_cumulative_time', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ time: cumulativeWaittime })
	}).catch(error => console.error("Error updating server time", error));

	updateCurrentWaitTimeDisplay();
	updateCumulativeWaitTimeDisplay();
}



// Fetches the cumulative wait time saved in the server
function fetchCumulativeTime() {
	fetch('/get_cumulative_time')
		.then(response => response.json())
		.then(data => {

			cumulativeWaittime = data.time;
			updateCumulativeWaitTimeDisplay();
		})
		.catch(error => {

			const savedTime = localStorage.getItem('cumulative_waittime');
			cumulativeWaittime = savedTime !== null ? savedTime : 0;

			updateCumulativeWaitTimeDisplay();
		})
}



// Updates current time elapsed on webpage
function updateCurrentWaitTimeDisplay() {
	document.getElementById("current-minutes").innerText = currentWaittime / 60 < 10 ? '0' + Math.floor(currentWaittime / 60) : Math.floor(currentWaittime / 60);
	document.getElementById("current-ten-seconds").innerText = (Math.floor(currentWaittime / 10)) % 6;
	document.getElementById("current-seconds").innerText = currentWaittime % 10;
}



// Updates cumulative wait time display
function updateCumulativeWaitTimeDisplay() {
	if(cumulativeWaittime < 0) {
		document.getElementById("cumulative-waittime-status").innerText = "Time Saved: "
		document.getElementById("cumulative-minutes").innerText = -cumulativeWaittime / 60 < 10 ? '0' + Math.floor(-cumulativeWaittime / 60) : Math.floor(-cumulativeWaittime / 60);
		document.getElementById("cumulative-ten-seconds").innerText = (Math.floor(-cumulativeWaittime / 10)) % 6;
		document.getElementById("cumulative-seconds").innerText = -cumulativeWaittime % 10;
	}
	else {
		document.getElementById("cumulative-waittime-status").innerText = "Time Wasted: "
		document.getElementById("cumulative-minutes").innerText = cumulativeWaittime / 60 < 10 ? '0' + Math.floor(cumulativeWaittime / 60) : Math.floor(cumulativeWaittime / 60);
		document.getElementById("cumulative-ten-seconds").innerText = (Math.floor(cumulativeWaittime / 10)) % 6;
		document.getElementById("cumulative-seconds").innerText = cumulativeWaittime % 10;
	}
}



// Matches current waittime height to the left column elements
function matchHeight() {
    // Get height of left column
    const leftColumn = document.querySelector('.col-md-8');
    const waitTimeBox = document.querySelector('#waittime-box');
    
    if (leftColumn && waitTimeBox && window.innerWidth >= 768) {
        waitTimeBox.style.height = leftColumn.offsetHeight - 0.01 + 'px'; // Reduce slight 0.01 height offset (was annoying to look at)
    }
}



// Call on page load and window resize
window.addEventListener('load', matchHeight);
window.addEventListener('resize', matchHeight);



// Fetches cumulative time of previous session on page load
document.addEventListener('DOMContentLoaded', () => {
	trackLocation();
	initMap();
	fetchCumulativeTime();
	updateCumulativeWaitTimeDisplay();
})

