document.addEventListener('DOMContentLoaded', () => {
    const scrollDownButton = document.getElementById('scrollDown');
    scrollDownButton.addEventListener('click', () => {
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    });
});


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

document.addEventListener('DOMContentLoaded', () => {
    const inventoryGrid = document.querySelector('.inventory-grid');
    const borrowForm = document.getElementById('borrow-form');
    const itemNameInput = document.getElementById('item-name');
    const borrowItemForm = document.getElementById('borrow-item-form');

    // Function to show the borrow form
    function showBorrowForm(itemName) {
        itemNameInput.value = itemName;
        borrowForm.style.opacity = '1';
        borrowForm.style.visibility = 'visible';
    }

    // Function to close the borrow form
    function closeBorrowForm() {
        borrowForm.style.opacity = '0';
        borrowForm.style.visibility = 'hidden';
        borrowItemForm.reset();
    }

    // Event listener for close button
    document.getElementById('close-form').addEventListener('click', closeBorrowForm);

    // Event listener for clicking outside the form
    borrowForm.addEventListener('click', (event) => {
        if (event.target === borrowForm) {
            closeBorrowForm();
        }
    });

    // Fetch and display inventory items
    function fetchInventoryItems() {
        const db = firebase.database();
        const inventoryRef = db.ref('inventory');

        inventoryRef.on('value', (snapshot) => {
            inventoryGrid.innerHTML = ''; // Clear existing items
            snapshot.forEach((childSnapshot) => {
                const item = childSnapshot.val();
                const itemId = childSnapshot.key;

                // Create a new grid item for each inventory item
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.innerHTML = `
                    <div class="item-bg" style="background-image: url('Images/${item.name.toLowerCase()}.jpg');"></div>
                    <div class="item-name">${item.name}</div>
                    <div class="status ${item.available > 0 ? 'available' : 'not-available'}">${item.available > 0 ? 'Available' : 'Not Available'}</div>
                `;
                itemDiv.addEventListener('click', () => showBorrowForm(item.name));
                inventoryGrid.appendChild(itemDiv);
            });
        });
    }

    // Handle borrow form submission
    borrowItemForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const itemName = itemNameInput.value;
        const studentId = document.getElementById('student-id').value;
        const borrowDate = document.getElementById('borrow-date').value;
        const returnDate = document.getElementById('return-date').value;

        const borrowRequestsRef = firebase.database().ref('borrow_requests');
        borrowRequestsRef.push({
            item: itemName,
            studentId: studentId,
            borrowDate: borrowDate,
            returnDate: returnDate,
            status: 'pending'
        }).then(() => {
            console.log('Borrow request submitted successfully');
            closeBorrowForm();
        }).catch((error) => {
            console.error('Error submitting borrow request:', error);
        });
    });

    // Initial fetch of inventory items
    fetchInventoryItems();
});
