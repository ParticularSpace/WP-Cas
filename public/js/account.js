document.addEventListener("DOMContentLoaded", function () {

    // Functions to handle each action
    function updatePicture() {
        const fileInput = document.querySelector('#upload-picture');
        const file = fileInput.files[0];

        if (!file) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        console.log('formData:', formData);
        console.log('About to fetch to upload file');

        // First, upload the file
        fetch('/api/users/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('data test in LINE 26 IN ACCOUNT>JS:', data);
                if (data.error) {
                    console.error(data.error);
                } else {
                    console.log('File uploaded successfully!');
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
                console.log('data test in LINE 42 IN ACCOUNT>JS:', data);
                if (data.error) {
                    console.error(data.error);
                } else {
                    // Update the image on the page
                    let profileImage = document.querySelector('#profile-pic'); // replace '#profile-image' with the actual ID of your img element
                    console.log('newPictureUrl:', data.newPictureUrl);
                    profileImage.src = `${data.newPictureUrl}?timestamp=${new Date().getTime()}`;

                    console.log('Profile picture updated successfully on the page!');
                }
            })
            .catch((error) => {
                console.error('Error: this is the one', error);
            });

    }

    // Change password GOOD
    function changePassword() {
        const currentPassword = document.querySelector('#current-password').value;
        const newPassword = document.querySelector('#new-password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;

        if (newPassword !== confirmPassword) {
            console.error('New passwords do not match');
            return;
        }
        console.log(currentPassword, newPassword, confirmPassword, 'account.js password change');

        console.log('About to fetch to update password');
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

    // Change username GOOD
    function updateUsername() {
        const password = document.querySelector('#password').value;
        const newUsername = document.querySelector('#new-username').value;

        fetch('/api/users/update/username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password, newUsername }), // include the password here
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


    function updateStatus() {
        // Code to update status
    }

    function deleteAccount() {
        // Code to delete account
    }

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

    document.querySelector('#update-status').addEventListener('click', (event) => {
        event.preventDefault();
        updateStatus();
    });

    document.querySelector('#delete-account').addEventListener('click', (event) => {
        event.preventDefault();
        deleteAccount();
    });
});
