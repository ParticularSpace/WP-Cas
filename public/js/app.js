const $username = document.getElementById('username');
const $password = document.getElementById('password');
const $loginBtn = document.querySelector('.login-button');
const $userList = document.querySelector('.userList');

$loginBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const username = $username.value;
  const password = $password.value;

  if (!username || !password) {
    return alert('Username and password must be provided');
  }

  // Send a POST request to the /login route
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });


  if (response.status === 200) {
    window.location.href = '/games';
  } else {

    const errorMessage = await response.text();
    alert(errorMessage);
  }
});
