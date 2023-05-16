const loginFormHandler = async (event) => {
  event.preventDefault(); // Prevent form submission

  console.log('loginFormHandler');

  const username = document.querySelector('#username-login').value.trim(); // Get the entered username
  const password = document.querySelector('#password-login').value.trim(); // Get the entered password

  console.log(username, password, 'app.js loginFormHandler 11')

  if (username && password) {
    try {
      console.log('About to call fetch');
      const response = await fetch('/api/users/login', { // Send a POST request to the login endpoint
        method: 'POST',
        body: JSON.stringify({ username, password }), // Send the username and password as JSON in the request body
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(response, 'app.js loginFormHandler 21');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      

      if (response.ok) {
        console.log('Response was OK');
        const data = await response.json(); // Get the response data as JSON
        console.log(data, 'app.js loginFormHandler 31');
        // If the login is successful, redirect to the dashboard page.
        document.location.replace('/dashboard');
      } else {
        console.log('Response was not OK');
        alert('Failed to log in');
      }
    } catch (err) {
      console.error('Error in fetch call', err);
    }
  }
};

const registerFormHandler = async (event) => {
  event.preventDefault(); // Prevent form submission

  const username = document.querySelector('#username-register').value.trim(); // Get the entered username
  const password = document.querySelector('#password-register').value.trim(); // Get the entered password

  if (username && password) {
    const response = await fetch('/api/users/register', { // Send a POST request to the register endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Send the username and password as JSON in the request body
    });

    if (response.ok) {
      // If the registration is successful, redirect to the login page.
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
