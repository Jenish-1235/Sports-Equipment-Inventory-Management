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

// Dashboard Overview
document.addEventListener('DOMContentLoaded', function () {
    const overviewRef = firebase.database().ref('overview');

    // Fetch and update UI with real data
    overviewRef.on('value', (snapshot) => {
        const data = snapshot.val();

        if (data) {
            document.getElementById('total-equipment-value').textContent = data.totalEquipment || 'N/A';
            document.getElementById('borrowed-equipment-value').textContent = data.borrowedEquipment || 'N/A';
            document.getElementById('available-equipment-value').textContent = data.availableEquipment || 'N/A';
            document.getElementById('maintenance-equipment-value').textContent = data.maintenanceRequired || 'N/A';

            // Equipment condition chart
            const conditionChart = document.getElementById('condition-chart');
            const goodCondition = data.equipmentCondition ? data.equipmentCondition.good : 0;
            const damagedCondition = data.equipmentCondition ? data.equipmentCondition.damaged : 0;

            conditionChart.innerHTML = `
                <div style="background-color: #28a745; width: ${goodCondition}%; height: 20px; margin-bottom: 5px;">Good</div>
                <div style="background-color: #dc3545; width: ${damagedCondition}%; height: 20px;">Damaged</div>
            `;
        } else {
            console.error('No data available for overview');
        }
    });
});

// Inventory Management
document.addEventListener('DOMContentLoaded', () => {
    const addItemBtn = document.getElementById('addItemBtn');
    const addItemForm = document.getElementById('addItemForm');
    const closeAddItemForm = document.querySelector('#addItemForm .close');
    const cancelAddItemBtn = document.getElementById('cancelAddItemBtn');
    const addItemFormContent = document.getElementById('addItemFormContent');
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');

    // Open the form
    addItemBtn.addEventListener('click', () => {
        addItemForm.style.display = 'block';
    });

    // Close the form
    closeAddItemForm.addEventListener('click', () => {
        addItemForm.style.display = 'none';
    });

    cancelAddItemBtn.addEventListener('click', () => {
        addItemForm.style.display = 'none';
    });

    // Close the form if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == addItemForm) {
            addItemForm.style.display = 'none';
        }
    });

    // Submit the form
    addItemFormContent.addEventListener('submit', (event) => {
        event.preventDefault();

        const itemName = document.getElementById('itemName').value;
        const itemCondition = document.getElementById('itemCondition').value;
        const itemStatus = document.getElementById('itemStatus').value;

        // Add data to Firebase
        const db = firebase.database();
        const inventoryRef = db.ref('inventory');
        const newItemRef = inventoryRef.push();

        newItemRef.set({
            name: itemName,
            condition: itemCondition,
            status: itemStatus
        }).then(() => {
            console.log('Item added successfully');
            addItemForm.style.display = 'none';
            fetchInventoryItems(); // Refresh the inventory list
        }).catch((error) => {
            console.error('Error adding item:', error);
        });
    });

    // Fetch and update the inventory list
    function fetchInventoryItems() {
        const db = firebase.database();
        const inventoryRef = db.ref('inventory');

        inventoryRef.on('value', (snapshot) => {
            inventoryTableBody.innerHTML = ''; // Clear existing rows
            snapshot.forEach((childSnapshot) => {
                const item = childSnapshot.val();
                const itemId = childSnapshot.key;

                // Create a new row for each item
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${itemId}</td>
                    <td>${item.name}</td>
                    <td>${item.condition}</td>
                    <td>${item.status}</td>
                    <td>
                        <button class="deleteBtn" data-id="${itemId}">Delete</button>
                    </td>
                `;
                inventoryTableBody.appendChild(row);
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.deleteBtn').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const itemId = event.target.getAttribute('data-id');
                    deleteItem(itemId);
                });
            });
        });
    }

    // Delete item from Firebase
    function deleteItem(itemId) {
        const db = firebase.database();
        const itemRef = db.ref(`inventory/${itemId}`);

        itemRef.remove().then(() => {
            console.log('Item deleted successfully');
            fetchInventoryItems(); // Refresh the inventory list
        }).catch((error) => {
            console.error('Error deleting item:', error);
        });
    }

    // Initial fetch of inventory items
    fetchInventoryItems();
});

// Borrow Requests
const borrowRequestsRef = firebase.database().ref('borrow_requests');

function renderBorrowRequests() {
    const borrowRequestsList = document.getElementById('borrow-requests-list');

    borrowRequestsList.innerHTML = '';

    borrowRequestsRef.on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const request = childSnapshot.val();
            const requestId = childSnapshot.key;

            // Determine button status based on current request status
            const isApproved = request.status === 'approved';
            const isDenied = request.status === 'denied';
            const approveButtonText = isApproved ? 'Approved' : 'Approve';
            const denyButtonText = isDenied ? 'Denied' : 'Deny';
            const approveButtonClass = isApproved ? 'disabled' : '';
            const denyButtonClass = isDenied ? 'disabled' : '';

            // Hide the other button if one is already in the desired state
            const approveButtonStyle = isDenied ? 'display: none;' : '';
            const denyButtonStyle = isApproved ? 'display: none;' : '';

            const requestItem = document.createElement('div');
            requestItem.className = 'borrow-request-item';
            requestItem.innerHTML = `
                <div class="borrow-request-details">
                    <div>Item: ${request.item}</div>
                    <div>Student ID: ${request.studentId}</div>
                    <div>Student Name: ${request.studentName}</div>
                </div>
                <div class="borrow-request-actions">
                    <button class="approve ${approveButtonClass}" data-id="${requestId}" style="${approveButtonStyle}">${approveButtonText}</button>
                    <button class="deny ${denyButtonClass}" data-id="${requestId}" style="${denyButtonStyle}">${denyButtonText}</button>
                </div>
            `;

            borrowRequestsList.appendChild(requestItem);
        });

        // Add event listeners for approve and deny buttons
        document.querySelectorAll('.approve').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const requestId = event.target.getAttribute('data-id');
                handleRequest(requestId, 'approved');
            });
        });

        document.querySelectorAll('.deny').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const requestId = event.target.getAttribute('data-id');
                handleRequest(requestId, 'denied');
            });
        });
    });
}

function handleRequest(requestId, status) {
    const requestRef = borrowRequestsRef.child(requestId);

    requestRef.update({ status }).then(() => {
        console.log(`Request ${status} successfully`);
        renderBorrowRequests(); // Refresh the borrow requests list
    }).catch((error) => {
        console.error(`Error updating request status: ${error}`);
    });
}

// Initial fetch of borrow requests
renderBorrowRequests();

// User Management
const blacklistForm = document.getElementById('blacklistForm');
const blacklistUserForm = document.getElementById('blacklistUserForm');
const blacklistTableBody = document.querySelector('#blacklistTable tbody');

// Add user to blacklist
blacklistForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const userId = blacklistUserForm.querySelector('#blacklistUserId').value;
    const rollNumber = blacklistUserForm.querySelector('#blacklistRollNumber').value;

    // Add user to blacklist in Firebase
    const db = firebase.database();
    const blacklistRef = db.ref('blacklist');
    blacklistRef.child(userId).set({
        rollNumber
    }).then(() => {
        console.log('User added to blacklist successfully');
        blacklistUserForm.reset();
        fetchBlacklistedUsers(); // Refresh the blacklist
    }).catch((error) => {
        console.error('Error adding user to blacklist:', error);
    });
});

// Fetch blacklisted users
function fetchBlacklistedUsers() {
    const db = firebase.database();
    const blacklistRef = db.ref('blacklist');

    blacklistRef.on('value', (snapshot) => {
        blacklistTableBody.innerHTML = ''; // Clear existing rows
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.rollNumber}</td>
                <td>
                    <button class="removeBlacklistedBtn" data-id="${userId}">Remove</button>
                </td>
            `;
            blacklistTableBody.appendChild(row);
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.removeBlacklistedBtn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const userId = event.target.getAttribute('data-id');
                removeFromBlacklist(userId);
            });
        });
    });
}

// Remove user from blacklist
function removeFromBlacklist(userId) {
    const db = firebase.database();
    const userRef = db.ref(`blacklist/${userId}`);

    userRef.remove().then(() => {
        console.log('User removed from blacklist successfully');
        fetchBlacklistedUsers(); // Refresh the blacklist
    }).catch((error) => {
        console.error('Error removing user from blacklist:', error);
    });
}

// Initial fetch of blacklisted users
fetchBlacklistedUsers();
