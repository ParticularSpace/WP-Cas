

const loginFormHandler = async (event) => {
  event.preventDefault();

  console.log('loginFormHandler');

  const username = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  console.log(username, password, 'app.js loginFormHandler 11')

  if (username && password) {
    try {
      console.log('About to call fetch');
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
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
        const data = await response.json();
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
  event.preventDefault();

  const username = document.querySelector('#username-register').value.trim();
  const password = document.querySelector('#password-register').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
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
    loginForm.addEventListener('submit', loginFormHandler);
  }

  let registerForm = document.querySelector('.register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', registerFormHandler);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateEventListeners();
});

