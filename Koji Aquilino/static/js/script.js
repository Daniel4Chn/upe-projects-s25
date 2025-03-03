"use strict"

const minimumDistanceThreshold = 300; // meters (normal=10m)
const waittimeThreshold = 300; // seconds (normal=300s/5min), adjustable

let nearest_station;
let timer;
let current_waittime = 0 // seconds
let cumulative_waittime = 0 // seconds
let isAtStation = false;



// Handles API errors
let handleError = (error) => {
    // Check specifically for timeout errors (error.code === 3)
    if (error.code === 3) {
        // Code to execute when geolocation times out
        console.error("Geolocation timed out!");
        
        // Update UI to notify user
        document.getElementById("station-header").innerText = "Location Service: ";
        document.getElementById("station-status").innerText = "Timed out. Retrying...";
        
        // Retries after a delay
        setTimeout(() => {
            console.log("Retrying geolocation after timeout...");
            trackLocation();
        }, 3000); // Wait 3 seconds before retrying
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

				updateNextTrainPrediction("eastbound");
				updateNextTrainPrediction("westbound");

				if(isAtStation) {
					startTimer();
					// updateNextTrainPrediction("eastbound");
					// updateNextTrainPrediction("westbound");
				}
				
				else {
					stopTimer();
					// document.getElementById("eastbound-train").innerText = "Proceed to the nearest station";
					// document.getElementById("eastbound-train-stops").innerText = "";
					// document.getElementById("westbound-train").innerText = "Proceed to the nearest station";
					// document.getElementById("westbound-train-stops").innerText = "";
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
			document.getElementById("westbound-train").innerText = "Train is approaching ";
			document.getElementById("westbound-train-stops").innerText = nearest_station + "...";
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




// Starts the current wait timer
function startTimer() {
	if(timer) {
		clearInterval(timer);
	}

	timer = setInterval(() => {
		current_waittime++;
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

// Updates current time elapsed on webpage
function updateCurrentWaitTimeDisplay() {
	document.getElementById("current-minutes").innerText = current_waittime / 60 < 10 ? '0' + Math.floor(current_waittime / 60) : Math.floor(current_waittime / 60);
	document.getElementById("current-ten-seconds").innerText = (Math.floor(current_waittime / 10)) % 6;
	document.getElementById("current-seconds").innerText = current_waittime % 10
}


// Adds the time to the cumulative time counter
function addTime() {
	cumulative_waittime += current_waittime - waittimeThreshold;
	current_waittime = 0;
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



// Alternative updates location every 5 seconds
// setInterval(trackLocation, 5000);

// Starts tracking as soon as page loads
trackLocation();

