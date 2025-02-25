"use strict"

// Handles API errors
let handleError = (error) => {
	console.error("Error getting location:", error);
	document.getElementById("locator-text").innerText = `Failed to retrieve location: ${error}`;
}

// Run on successful callback
function updateLocation(position) {
	console.log(position);
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;
	document.getElementById("locator-text").innerText = `Latitude: ${lat}, Longitude: ${lon}`;
	sendLocationToServer(lat, lon);
	
	// Send to backend (Flask)
	fetch('/update_location', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }, 
		body: JSON.stringify({ lat, lon })
	})
	.then(response => response.json()) // converts backend response to json format for front end to parse
	.then(data => console.log("Server Response:", data)) // Handle response from server
	.catch(error => console.log("Error:", error));
}


// Tracks location with .watchPosition()
function trackLocation() {
	if("geolocation" in navigator) {
		// navigator.geolocation.watchPosition(updateLocation, handleError, {
		navigator.geolocation.getCurrentPosition(updateLocation, handleError, {
			enableHighAccuracy: true, // Precise location data
			maximumAge: 10000, // 10 seconds cached location
			timeout: 5000 // 5 seconds to retrieve before timeout
		})
	}
	else {
		alert("Geolocator is not supported by this browser.");
	}
}

// Sends current coordinates to backend
function sendLocationToServer(lat, lon) {
	fetch("/update_location", {
		method: "POST",
		headers: { "Content-Type": "application/json"}, 
		body: JSON.stringify({ latitude: lat, longitude: lon })
	})
	.then(response => response.json())
	.then(data => console.log("Server response:", data)) // Data sent by server signalling fetch status
	.catch(error => console.error("Error sending data:", error))
}

// Starts tracking as soon as page loads
// trackLocation();

// Alternatively updates location every 3 seconds
setInterval(trackLocation, 3000);

