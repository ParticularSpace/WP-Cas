

const loginFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log(response);

    if (response.ok) {
      // If the login is successful, redirect to the games page.
      document.location.replace('/dashboard');
    } else {
      alert('Failed to log in');
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

    console.log(response);

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

document.addEventListener("DOMContentLoaded", function() {
  updateEventListeners();
});

