let count = 0; // Starts counter at 0
document.getElementById("Btn-inc").addEventListener("click", function() {
	count++;
	document.getElementById("counter").innerText = count; // Updates the text with each click/increment
});

console.log("JS file loaded");

