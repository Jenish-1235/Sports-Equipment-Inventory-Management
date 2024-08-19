// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrQiOeKqVHxC8rRZjJjO_YbNs19zwbgKY",
    authDomain: "sports-equipment-invento-5b242.firebaseapp.com",
    databaseURL: "https://sports-equipment-invento-5b242-default-rtdb.firebaseio.com",
    projectId: "sports-equipment-invento-5b242",
    storageBucket: "sports-equipment-invento-5b242.appspot.com",
    messagingSenderId: "496964259427",
    appId: "1:496964259427:web:2422d1005c1e4fbf0fb256",
    measurementId: "G-0XNK39MT9J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Function to handle login
function handleLogin(event) {
    event.preventDefault();

    const role = document.querySelector('input[name="role"]:checked').value;
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    if (role === 'student') {
        checkBlacklist(userId);
    } else if (role === 'admin') {
        handleAdminLogin(password);
    } else {
        alert("Please select a role.");
    }
}

// Function to check if the student is blacklisted
function checkBlacklist(studentId) {
    const db = firebase.database();
    const blacklistRef = db.ref('blacklist');

    blacklistRef.orderByChild('rollNumber').equalTo(studentId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            alert("You can't log in. You have been blacklisted by the admin.");
        } else {
            alert("Login successful!");
            // Redirect to student dashboard
            window.location.href = 'student_dashboard.html'; 
        }
    }).catch((error) => {
        console.error('Error checking blacklist:', error);
    });
}

// Function to handle admin login
function handleAdminLogin(password) {
    const hardcodedAdminPassword = "admin123";

    if (password === hardcodedAdminPassword) {
        alert("Admin login successful!");
        // Redirect to admin dashboard
        window.location.href = 'admin_dashboard.html'; 
    } else {
        alert("Incorrect admin password.");
    }
}

// Add event listener to login form
document.getElementById('loginForm').addEventListener('submit', handleLogin);
