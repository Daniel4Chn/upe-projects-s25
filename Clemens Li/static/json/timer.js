const dueDate = new Date(time);

function updateTimer() {
    const now = new Date();
    const diff = dueDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
        document.getElementById("timer").innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        document.getElementById("timer").innerHTML = 
            "No upcoming assignments"
    }

    
    
}

updateTimer();
setInterval(updateTimer, 1000);



// Update timer immediately and every second
