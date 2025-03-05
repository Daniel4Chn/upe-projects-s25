const dueDate = new Date(time);

function updateTimer() {
    const now = new Date();
    const diff = dueDate - now;
    const timerElement = document.getElementById('timer');
    const countdownElement = document.querySelector('.timer-countdown');

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
        countdownElement.innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (days < 1 && hours < 12) {
            updateTimerElement.className = "timer-urgent";
        } else if (days < 1) {
            updateTimerElement.className = "timer-warning2";
        } else if (days < 3) {
            timerElement.className = "timer-warning";
        } else {
            timerElement.className = "timer-safe";
        }
    } else {
        countdownElement.innerHTML = 
            "Nothing Due!";
        timerElement.className =
            "timer-na";
    }
    
}

updateTimer();
setInterval(updateTimer, 1000);



// Update timer immediately and every second
