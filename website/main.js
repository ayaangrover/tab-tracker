async function fetchStudents() {
    try {
        const response = await fetch('https://d1af270f-5b2a-4e81-97ef-1383b66ba676-00-1an6e8o4o3ogo.worf.replit.dev/activity', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const activities = await response.json();
            
            // Log the response to verify the structure
            console.log("Activities fetched:", activities);
            
            if (activities && activities.length > 0) {
                displayStudentList(activities);
            } else {
                console.error('No activities found.');
            }
        } else {
            console.error('Failed to fetch students');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

function displayStudentList(activities) {
    const studentList = document.querySelector('.student-list');
    studentList.innerHTML = ''; // Clear existing student buttons

    activities.forEach(activity => {
        // Check what data we have for userId
        console.log("Activity data for student:", activity);

        const username = activity.userId?.username || activity.userId || "Unknown User";

        const studentButton = document.createElement('button');
        studentButton.textContent = username;
        studentButton.addEventListener('click', () => {
            displayStudentActivity(activity);
        });
        studentList.appendChild(studentButton);
    });
}

// Function to display a selected student's activity
function displayStudentActivity(activity) {
    const tableBody = document.getElementById('activityTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing data

    // Set selected student heading
    const selectedStudent = document.getElementById('selectedStudent');
    selectedStudent.textContent = `Activity for ${activity.userId.username}`;

    activity.activity.forEach(tab => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tab.tabVisited}</td>
            <td>${new Date(tab.timestamp).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch student data when the page loads
window.onload = fetchStudents;
