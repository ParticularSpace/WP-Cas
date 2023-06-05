document.addEventListener("DOMContentLoaded", function () {

    // function to update profile picture
    function updatePicture() {
        const fileInput = document.querySelector('#upload-picture');
        const file = fileInput.files[0];

        if (!file) {
            console.error('No file selected');
            return;
        }

        // Create a new FormData object
        const formData = new FormData();
        formData.append('profilePicture', file);

        // First, upload the file
        fetch('/api/users/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                
                if (data.error) {
                    console.error(data.error);
                } else {
                    // Then, update the profile picture
                    return fetch('/api/users/update/profile-picture', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ location: data.fileUrl })
                    });
                }
            })
            .then(response => response.json())
            .then(data => {
               
                if (data.error) {
                    console.error(data.error);
                } else {
                    // Update the image on the page
                    let profileImage = document.querySelector('#profile-pic'); 
                    // Add a timestamp to the URL to force the browser to refresh the image
                    profileImage.src = `${data.newPictureUrl}?timestamp=${new Date().getTime()}`;
                }
            })
            .catch((error) => {
                console.error('Error: this is the one', error);
            });

    }

    // Change password 
    function changePassword() {
        const currentPassword = document.querySelector('#current-password').value;
        const newPassword = document.querySelector('#new-password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        // Check that the new password match
        if (newPassword !== confirmPassword) {
            console.error('New passwords do not match');
            return;
        }
        
        // Send the request to the server
        fetch('/api/users/update/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    console.log('Password updated successfully!');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // Change username 
    function updateUsername() {
        const password = document.querySelector('#password').value;
        const newUsername = document.querySelector('#new-username').value;

        fetch('/api/users/update/username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password, newUsername }), // Send the username and password as JSON in the request body
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    //update teh username on the page
                    document.querySelector('#username').textContent = newUsername;
                    console.log('username updated successfully!');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    async function deleteAccount() {
        // Add confirmation
        const confirmation = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
        // If the user clicked ok
        if (confirmation) {
            try {
                const response = await fetch('/api/users/delete', { 
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
    
                if (response.ok) {
                    alert('Account deleted successfully!');
                    // If deletion was successful, redirect to the login page
                    document.location.replace('/login'); 
                } else {
                    alert('Failed to delete account.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    // button to view the user's game history will make a call to /api/users/game-history first create a function then we attach event listener

    async function getGameHistory() {
        try {
            const response = await fetch('/blackjack');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }



    document.querySelector('#game-history').addEventListener('click', (event) => {
        event.preventDefault();
        getGameHistory();
    });

    // Attach event listeners
    document.querySelector('#update-picture').addEventListener('click', (event) => {
        event.preventDefault();
        updatePicture();
    });

    document.querySelector('#change-password').addEventListener('click', (event) => {
        event.preventDefault();
        changePassword();
    });

    document.querySelector('#update-username').addEventListener('click', (event) => {
        event.preventDefault();
        updateUsername();
    });

    document.querySelector('#delete-account').addEventListener('click', (event) => {
        event.preventDefault();
        deleteAccount();
    });
});
