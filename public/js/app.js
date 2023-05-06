const $username = document.getElementById('username');
const $password = document.getElementById('password');
const $submitBtn = document.getElementById('submitBtn');
const $userList = document.querySelector('.userList');

$submitBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const username = $username.value;
  const password = $password.value;

  if (!username || !password) {
    return alert('Username and password must be provided');
  }

  console.log(username, password);
  
});