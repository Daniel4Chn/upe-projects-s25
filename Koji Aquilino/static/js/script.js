"use strict"

// Handles API errors
let handleError = (error) => {
	console.error("Error getting location:", error);
	document.getElementById("locator-text").innerText = `Failed to retrieve location: ${error}`;
}


// Run on successful callback: Sends location to backend
function updateLocation(position) {

	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	const accuracy = position.coords.accuracy;

	console.log(`Accuracy: ${accuracy} meters`);

	fetch("/update_location", {
		method: "POST",
		headers: { "Content-Type": "application/json"}, 
		body: JSON.stringify({ latitude: latitude, longitude: longitude, accuracy: accuracy })
	})
	.then(response => response.json())
	.then(data => {

		console.log(data);

		if(data.status === "success") {
			document.getElementById("locator-text").innerText = data.message;
		}
		else {
			document.getElementById("locator-text").innerText = `Failed to retrieve location: ${data.message}`;
		}

	})
	.catch(error => console.error("Error sending data:", error))
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






// Alternatively updates location every 5 seconds
// setInterval(trackLocation, 5000);

// Starts tracking as soon as page loads
trackLocation();

