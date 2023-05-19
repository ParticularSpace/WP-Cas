async function addFunds(amount) {
    try {
      const response = await fetch('/api/wallet/fund', {
        method: 'POST',
        body: JSON.stringify({ amount }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        throw new Error('Failed to add funds');
      }
  
      const walletData = await response.json();
  
      // Get the paragraph tag that displays the balance
      const balanceElement = document.querySelector('.wallet-wrapper p');
      if (balanceElement) {
        balanceElement.innerText = 'Current Balance: ' + walletData.balance + ' Four-Leaf Coins';
      }

      // Get the navigation balance
    const navBalanceElement = document.querySelector('.navbar-item .dropdown-item:nth-child(2)');
    if (navBalanceElement) {
      navBalanceElement.innerText = 'Wallet: ' + walletData.balance;
    }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Assume this event is triggered when user clicks a button or something
  const addFundsButton = document.querySelector('#addFundsForm button');
  const amountInputElement = document.querySelector('#amount');
  
  addFundsButton.addEventListener('click', (e) => {
    e.preventDefault(); // prevent form from submitting and refreshing the page
    const inputAmount = amountInputElement.value; // Get the input value from a form or something
    addFunds(inputAmount);
  });
  
