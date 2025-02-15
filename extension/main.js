document.addEventListener('DOMContentLoaded', async () => {
    chrome.storage.local.get(['userId'], (result) => {
        if (result.userId) {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        } else {
            document.getElementById('loginForm').style.display = 'block';
        }
    });
    document.getElementById('toggleToSignup').addEventListener('click', () => {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    });

    document.getElementById('toggleToLogin').addEventListener('click', () => {
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });
    document.getElementById('loginButton').addEventListener('click', async () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch('https://d1af270f-5b2a-4e81-97ef-1383b66ba676-00-1an6e8o4o3ogo.worf.replit.dev/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            const userId = data.userId;
            chrome.storage.local.set({ userId: userId }, () => {
                console.log('User ID saved.');
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('signupForm').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
            });
            chrome.runtime.sendMessage({ action: 'login', userId: userId });
        } else {
            alert('Login failed. Please check your credentials.');
        }
    });

    document.getElementById('signupButton').addEventListener('click', async () => {
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;

        const response = await fetch('https://d1af270f-5b2a-4e81-97ef-1383b66ba676-00-1an6e8o4o3ogo.worf.replit.dev/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            const userId = data.userId;

            chrome.storage.local.set({ userId: userId }, () => {
                console.log('User ID saved.');
                document.getElementById('signupForm').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
            });

            chrome.runtime.sendMessage({ action: 'login', userId: userId });
        } else {
            alert('Signup failed. Please try again.');
        }
    });
});
