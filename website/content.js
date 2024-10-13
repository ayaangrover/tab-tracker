async function fetchActivityData() {
    const response = await fetch('https://d1af270f-5b2a-4e81-97ef-1383b66ba676-00-1an6e8o4o3ogo.worf.replit.dev/activity', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const activities = await response.json();
        populateActivityTable(activities);
    } else {
        console.error('Failed to fetch activity data');
    }
}

function populateActivityTable(activities) {
    const tableBody = document.getElementById('activityTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing data

    activities.forEach(activity => {
        // Access the array of activities
        activity.activity.forEach(tab => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.userId || 'Unknown User'}</td>
                <td>${tab.tabVisited || 'N/A'}</td>
                <td>${tab.timestamp ? new Date(tab.timestamp).toLocaleString() : 'Invalid Date'}</td>
            `;
            tableBody.appendChild(row);
        });
    });
}

// Fetch activity data when the page loads
document.addEventListener('DOMContentLoaded', fetchActivityData);
