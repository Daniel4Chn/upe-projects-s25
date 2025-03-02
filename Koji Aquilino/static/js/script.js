"use strict"

const minimumDistanceThreshold = 10; // meters (normal=10m)
let isAtStation = false;
let nearest_station = undefined;

// Handles API errors
let handleError = (error) => console.error("Error getting location:", error);


// Run on successful callback: Sends location to backend
function updateLocation(position) {

	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	const accuracy = position.coords.accuracy;

	fetch("/update_location", {
		method: "POST",
		headers: { "Content-Type": "application/json"}, 
		body: JSON.stringify({ latitude: latitude, longitude: longitude, accuracy: accuracy })
	})
	.then(response => response.json())
	.then(data => {
		
		if(data.status === "success") {
			updateNearestStation()
			.then(() => {

				if(isAtStation) {
					updateNextTrainPrediction("eastbound");
					updateNextTrainPrediction("westbound");
				}
				
				else {
					document.getElementById("eastbound-train").innerText = "Proceed to the nearest station";
					document.getElementById("eastbound-train-stops").innerText = "";
					document.getElementById("westbound-train").innerText = "Proceed to the nearest station";
					document.getElementById("westbound-train-stops").innerText = "";
				}
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
			timeout: 5000 // 5 seconds to retrieve before timeout
		})
	}
	else {
		alert("Geolocator is not supported by this browser.");
	}
}


// Updates nearest station to user
async function updateNearestStation() {
	return fetch("/update_nearest_station")
	.then(response => response.json())
	.then(data => {

		nearest_station = data.message[1];
		
		if(data.message[0] <= minimumDistanceThreshold) {
			isAtStation = true;
			document.getElementById("station-header").innerText = "Current Station: ";
			document.getElementById("station-status").innerText = data.message[1];
		}
		else {
			isAtStation = false;
			document.getElementById("station-header").innerText = `${data.message[1]}: `;
			document.getElementById("station-status").innerText = `${Math.trunc(data.message[0])} meters away`;
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
			document.getElementById("eastbound-train").innerText = "Train is approaching ";
			document.getElementById("eastbound-train-stops").innerText = nearest_station + "...";
		}
		else {
			document.getElementById("eastbound-train").innerText = "Next train in ";

			if(data.message === 1) {
				document.getElementById("eastbound-train-stops").innerText = data.message + " stop";
			}
			else {
				document.getElementById("eastbound-train-stops").innerText = data.message + " stops";
			}
		}
	}

	else if(direction === "westbound") {
		if(data.message === 0) {
			document.getElementById("westbound-train").innerText = "Train is approaching ";
			document.getElementById("westbound-train-stops").innerText = nearest_station + "...";
		}
		else {
			document.getElementById("westbound-train").innerText = "Next train in ";

			if(data.message === 1) {
				document.getElementById("westbound-train-stops").innerText = data.message + " stop";
			}
			else {
				document.getElementById("westbound-train-stops").innerText = data.message + " stops";
			}
		}
	}

	else {
		throw new TypeError("Parameter must be 'westbound' or 'eastbound', along with passing in the json data from the parent call");
	}
}


// Additionally updates location every 10 seconds - ensures at least constant updates
setInterval(trackLocation, 10000);

// Starts tracking as soon as page loads
trackLocation();

