
// handle the login form submission
const loginFormHandler = async (event) => {
  event.preventDefault(); // Prevent form submission


  const username = document.querySelector('#username-login').value.trim(); // Get the entered username
  const password = document.querySelector('#password-login').value.trim(); // Get the entered password

  console.log(username, password, 'app.js loginFormHandler 11')

  // Check that the username and password are not empty
  if (username && password) {
    try {
      console.log('About to call fetch');
      // send a POST request to the login endpoint
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      if (response.ok) {
        const data = await response.json(); // Get the response data as JSON
      
        const welcomeMessage = data.message; // Get the welcome message from the server
      
        sessionStorage.setItem('welcomeMessage',welcomeMessage); // Store the welcome message in sessionStorage
      
        document.location.replace('/dashboard');
      } else {
        console.log('Response was not OK');
      }
      } catch (err) {
        window.alert('Password or username is incorrect. Please try again.');
        document.location.reload();
        console.error('Error in fetch call', err);
      } 
  }
};


const registerFormHandler = async (event) => {
  event.preventDefault(); // Prevent form submission

  const username = document.querySelector('#username-register').value.trim(); // Get the entered username
  const password = document.querySelector('#password-register').value.trim(); // Get the entered password

  if (username && password) {
    // Send a POST request to the register endpoint
    const response = await fetch('/api/users/register', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    // If the registration is successful, redirect to the login page.
    if (response.ok) {
      document.location.replace('/login');
    } else {
      alert('Failed to register');
    }
  }
};

function updateEventListeners() {
  let loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', loginFormHandler); // Attach the loginFormHandler function to the login form submit event
  }

  let registerForm = document.querySelector('.register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', registerFormHandler); // Attach the registerFormHandler function to the register form submit event
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateEventListeners(); // Call the updateEventListeners function when the DOM is loaded
});

// logout function and listener
const logout = async () => {
  const response = await fetch('/api/users/logout', { // Send a POST request to the logout endpoint
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    // If the logout is successful, redirect to the login page.
    document.location.replace('/login');
  } else {
    alert('Failed to log out');
  }
};

// logout event listener
let logoutButton = document.querySelector('#logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
};


// making a call to /games when the user clicks the Get Started button
const getStarted = async () => {
  const response = await fetch('/games', { // Send a GET request to the games endpoint
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    // If the call is successful, redirect to the games page.
    document.location.replace('/games');
  } else {
    alert('Failed to get started');
  }
};





