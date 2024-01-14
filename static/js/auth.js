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
});

const signupForm = document.querySelector('#signupForm');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signupForm.querySelector('input[name="email"]').value;
    const username = signupForm.querySelector('input[name="username"]').value;
    const password = signupForm.querySelector('input[name="password"]').value;
    const firstName = signupForm.querySelector('input[name="firstName"]').value;
    const lastName = signupForm.querySelector('input[name="lastName"]').value;
    const repeatPassword = signupForm.querySelector('input[name="repeatPassword"]').value;

    const options = {
        method: "POST",
        body: JSON.stringify({ email, username, password, firstName, lastName, repeatPassword }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch("http://localhost:8081/api/user/signup", options);

        let responseData = null;
        const errorDiv = signupForm.querySelector('#signupError');

        if (response.headers.get("content-type") !== "application/json; charset=utf-8") {
            // Show error
            errorDiv.innerHTML = await response.text();
            errorDiv.classList.remove('d-none');
        } else {
            // Signed in
            errorDiv.classList.add('d-none');
            responseData = await response.json();
            localStorage.setItem('auth', responseData.token);
            window.location = "/me";
        }

    } catch (error) {
        console.error("Error during signup:", error);
    }
})
