const logoutButton = document.querySelector('#logoutButton');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('auth');
    window.location = '/auth';
})