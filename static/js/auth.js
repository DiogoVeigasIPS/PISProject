const showRegistrationForm = () => {
    document.querySelector('#loginCard').classList.add('d-none');
    document.querySelector('#registrationCard').classList.remove('d-none');
}

const showLoginForm = () => {
    document.querySelector('#registrationCard').classList.add('d-none');
    document.querySelector('#loginCard').classList.remove('d-none');
}

const loginForm = document.querySelector('#loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = loginForm.querySelector('input[name="username"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    const options = {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch("http://localhost:8081/api/user/login", options);

        let responseData = null;
        const errorDiv = loginForm.querySelector('#loginError');

        if (response.headers.get("content-type") !== "application/json; charset=utf-8") {
            // Show error
            errorDiv.innerHTML = await response.text();
            errorDiv.classList.remove('d-none');
        } else {
            // Log in
            errorDiv.classList.add('d-none');
            responseData = await response.json();
            localStorage.setItem('auth', responseData.token);
            window.location = "/me";
        }

    } catch (error) {
        console.error("Error during login:", error);
    }
})
