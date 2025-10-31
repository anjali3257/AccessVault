// Attach login handler only if on login page
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;
        const message = document.getElementById('message');

        if (username === 'admin' && password === 'admin123' && role === 'admin') {
            window.location.href = 'dashboard.html';
        } else if (username === 'user' && password === 'user123' && role === 'user') {
            window.location.href = 'user.html';
        } else {
            message.textContent = 'Invalid credentials or role!';
        }
    });
}

// Dummy session data for testing
const dummySessions = [
    { user: 'admin', role: 'Admin', loginTime: '2025-10-30 10:15', activity: 'Viewed user logs', screen: '📷 View' },
    { user: 'user1', role: 'User', loginTime: '2025-10-30 10:30', activity: 'Accessed confidential file', screen: '📷 View' },
    { user: 'user2', role: 'User', loginTime: '2025-10-30 10:45', activity: 'Executed command: delete temp.log', screen: '📷 View' }
];
// Load real user logs from backend
function loadDashboard() {
    const tableBody = document.querySelector('#sessionTable tbody');
    if (!tableBody) return;

    fetch('http://127.0.0.1:5000/get_logs')
        .then(res => res.json())
        .then(data => {
            tableBody.innerHTML = '';
            let users = new Set();
            let totalActions = data.length;
            let userCountMap = {};

            data.forEach((log, index) => {
    users.add(log.user);
    userCountMap[log.user] = (userCountMap[log.user] || 0) + 1;

    const userId = "USR-" + String(index + 1001).padStart(4, '0');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${userId}</td>
        <td>${log.user}</td>
        <td>User</td>
        <td>${log.timestamp}</td>
        <td>${log.action}</td>
        <td><button class="view-btn" onclick="openPopup()">📷 View</button></td>
    `;
    tableBody.appendChild(row);
});


            // 🧾 Update analytics section
            document.getElementById('totalUsers').innerText = users.size;
            document.getElementById('totalActions').innerText = totalActions;

            // Find most active user
            let mostActive = Object.entries(userCountMap).sort((a, b) => b[1] - a[1])[0];
            document.getElementById('activeUser').innerText = mostActive ? mostActive[0] : 'N/A';

            // Last activity
            if (data.length > 0) {
                document.getElementById('lastActivity').innerText = data[data.length - 1].timestamp;
            }
        })
        .catch(err => console.error('Error loading dashboard:', err));
}


// User Session: Action Logging
function logAction() {
    const input = document.getElementById('commandInput');
    const command = input.value.trim();
    const tableBody = document.querySelector('#logTable tbody');

    if (command === '') return;

    const time = new Date().toLocaleTimeString();
    const row = document.createElement('tr');
    row.innerHTML = `<td>${time}</td><td>${command}</td>`;
    tableBody.appendChild(row);

    // Send to backend
    fetch('http://127.0.0.1:5000/log_action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user: 'user',      // later we can make this dynamic (e.g., login username)
            action: command
        })
    })
    .then(res => res.json())
    .then(data => console.log(data.message))
    .catch(err => console.error('Error logging action:', err));

    input.value = '';
}
// Logout button
function logout() {
    window.location.href = 'index.html';
}

// Automatically load dashboard if on that page
if (window.location.pathname.includes('dashboard.html')) {
    loadDashboard();
}
// ===== Screen View Simulation =====
function openPopup() {
    const popup = document.getElementById('screenPopup');
    const image = document.getElementById('screenImage');

    // Random tech images to simulate live screen feed
    const images = [
        'https://picsum.photos/800/400?random=1',
        'https://picsum.photos/800/400?random=2',
        'https://picsum.photos/800/400?random=3',
        'https://picsum.photos/800/400?random=4',
        'https://picsum.photos/800/400?random=5'
    ];

    // Pick a random one
    const randomImage = images[Math.floor(Math.random() * images.length)];
    image.src = randomImage;

    popup.style.display = 'flex';
}


function closePopup() {
    document.getElementById('screenPopup').style.display = 'none';
}
const ctx = document.getElementById('userChart').getContext('2d');
new Chart(ctx, {
type: 'doughnut',
data: {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [{
    data: [12, 3],
    backgroundColor: ['#00c6ff', '#007bff']
    }]
}
});
setInterval(() => {
const now = new Date();
document.getElementById("lastActivity").innerText = now.toLocaleString();
}, 1000);
// ===== Simulate System Health Changes =====
function updateSystemHealth() {
    const healthBox = document.querySelector('.health-box');
    const statusText = document.getElementById('systemStatus');

    // Randomly simulate alert state
    const healthy = Math.random() > 0.2; // 80% good, 20% alert
    if (healthy) {
        healthBox.classList.remove('alert');
        statusText.textContent = "🟢 All Systems Operational";
    } else {
        healthBox.classList.add('alert');
        statusText.textContent = "🔴 Performance Alert Detected!";
    }
}

// Update every 10 seconds
setInterval(updateSystemHealth, 10000);



