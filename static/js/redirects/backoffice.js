(async () => {
    try {
        const token = localStorage.getItem('auth');
        const response = await fetch("http://localhost:8081/api/user/loggedIn", {
            headers: { 'x-access-token': token }
        });
        
        const responseData = await response.json();

        if (response.status == 200 && responseData.isAdmin) {
            const container = document.getElementById('container');
            container?.classList.remove('d-none');
        }else{
            window.location.href = '/unauthorized';
        }
    } catch (err) {
        console.error(err);
    }
})();