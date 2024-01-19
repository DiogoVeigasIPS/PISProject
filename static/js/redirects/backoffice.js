(async () => {
    try {
        const token = localStorage.getItem('auth');
        const response = await fetch("http://localhost:8081/api/user/logged-in", {
            headers: { 'x-access-token': token }
        });

        const responseData = await response.json();

        if (response.status == 200 && responseData.isAdmin) {
            document.getElementById('container').classList.remove('d-none');
            document.getElementById('navbar').classList.add('d-none');
            document.getElementById('backNavbar').classList.remove('d-none');
        }else{
            window.location.href = '/unauthorized';
        }
    } catch (err) {
        console.error(err);
    }
})();