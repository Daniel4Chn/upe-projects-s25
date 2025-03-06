function createCalendar() {
    const date = new Date();
    const assignments = JSON.parse(document.getElementById('assignments-data').textContent);
    
    function updateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysContainer = document.getElementById('calendar-days');
        const monthDisplay = document.getElementById('currentMonth');
        
        monthDisplay.textContent = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });
        daysContainer.innerHTML = '';
        
        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            daysContainer.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = i;
            
            // Check if day has assignment due
            const currentDate = new Date(year, month, i);

            if (currentDate.getDate() === date.getDate() && 
                currentDate.getMonth() === date.getMonth() && 
                currentDate.getFullYear() === date.getFullYear()) {
                dayDiv.classList.add('today');
            }

            if (hasAssignment(currentDate, assignments)) {
                const days_left = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
                if (currentDate - date > 0) {
                    if (days_left < 1) {
                        dayDiv.classList.add('due-date-urgent');
                    } else if (days_left < 3) {
                        dayDiv.classList.add('due-date-warning');
                    } else {
                        dayDiv.classList.add('due-date-safe');
                    }
                }
            }

            daysContainer.appendChild(dayDiv);
        }
    }
    
    function hasAssignment(date, assignments) {
        for (const assignment of assignments) {
            const dueDate = new Date(assignment.due_date);
            if (dueDate.toDateString() === date.toDateString()) {
                return true;
            }
        }
        return false;
    }
    
    // Initialize calendar
    updateCalendar(date.getFullYear(), date.getMonth());
}

document.addEventListener('DOMContentLoaded', createCalendar);