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

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    });
    const data = await response.json();
  //  create li html element
    const $li = document.createElement('li');
  //  create anchor tag
    const $a = document.createElement('a');
//  set href attribute
    $a.setAttribute('href', `/users/${data.id}`);
//  set text content
    $a.textContent = data.username;
  //  create p tag
    const $p = document.createElement('p');
  //  set text content
    $p.textContent = data.password;
  //  append anchor tag to li
    $li.appendChild($a);
  //  append p tag to li
    $li.appendChild($p);
    // append li to ul
    $userList.appendChild($li);
    $username.value = '';
    $password.value = '';
  } catch (error) {
    alert(error);
  }


});