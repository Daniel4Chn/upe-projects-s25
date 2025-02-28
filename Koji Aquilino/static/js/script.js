"use strict"

const minimumDistanceThreshold = 10; // meters
let isAtStation = false;

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
			updateNearestStation();

			if(isAtStation) {
				updateNextTrainPrediction();
			}
			else {
				document.getElementById("nearest-train").innerText = "...";
				document.getElementById("nearest-train-stops").innerText = "";
			}
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
function updateNearestStation() {
	fetch("/update_nearest_station")
	.then(response => response.json())
	.then(data => {

		if(data.message[0] <= minimumDistanceThreshold) {
			isAtStation = false;
			document.getElementById("station-header").innerText = "Current Station: ";
			document.getElementById("station-status").innerText = data.message[1];
		}
		else {
			isAtStation = true;
			document.getElementById("station-header").innerText = `${data.message[1]}: `;
			document.getElementById("station-status").innerText = `${Math.trunc(data.message[0])} meters away`;
		}
	})
	.catch(error => console.error("Error retrieving station data:", error));
}

// Fetches and updates the nearest train predictions for next arrival
function updateNextTrainPrediction() {
	fetch("/update_next_train_prediction")
	.then(response => response.json())
	.then(data => {
		document.getElementById("nearest-train").innerText = "Next train: ";
		document.getElementById("nearest-train-stops").innerText = data.message;
	})
	.catch(error => console.error("Error retrieving train predictions:", error));

}


// Alternatively updates location every 5 seconds
//  setInterval(trackLocation, 5000);

// Starts tracking as soon as page loads
trackLocation();

