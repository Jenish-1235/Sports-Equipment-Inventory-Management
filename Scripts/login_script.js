// Initialize Firebase
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
const auth = firebase.auth();
const database = firebase.database();

document.getElementById('userData').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const rollNumber = document.getElementById('rollNumber').value;
    const adminPassword = document.getElementById('adminPassword').value;
    const loginTime = new Date().toLocaleString(); // Get the current date and time

    // Perform basic validation
    if (role === 'student' && !rollNumber) {
        alert('Please enter your roll number.');
        return;
    }

    if (role === 'admin' && !adminPassword) {
        alert('Please enter the admin password.');
        return;
    }

    // Simulate a simple login based on the role selected
    auth.signInAnonymously().then(() => {
        const user = auth.currentUser;
        const userId = user.uid;

        // Save user data to Firebase Realtime Database
        database.ref('users').push({
            name: name,
            role: role,
            rollNumber: role === 'student' ? rollNumber : null,
            adminPassword: role === 'admin' ? adminPassword : null,
            loginTime: loginTime
        }).then(() => {
            // Redirect based on role
            if (role === 'admin') {
                window.location.href = 'admin_dashboard.html'; // Redirect to admin panel
            } else if (role === 'student') {
                window.location.href = 'student_dashboard.html'; // Redirect to student dashboard
            }
        }).catch((error) => {
            console.error("Error saving user data: ", error);
        });

    }).catch((error) => {
        console.error("Error signing in: ", error);
    });
});
