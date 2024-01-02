const showRegistrationForm = () => {
    document.querySelector('#loginCard').classList.add('d-none');
    document.querySelector('#registrationCard').classList.remove('d-none');
}

const showLoginForm = () => {
    document.querySelector('#registrationCard').classList.add('d-none');
    document.querySelector('#loginCard').classList.remove('d-none');
}