(async () => {
    try {
        const token = localStorage.getItem('auth');
        const response = await fetch("http://localhost:8081/api/user/loggedIn", {
            headers: { 'x-access-token': token }
        });

        if (response.status == 200) {
            window.location.href = '/me';
        }else{
            document.getElementById('container').classList.remove('d-none');
        }
    } catch (err) {
        console.error(err);
    }
})();