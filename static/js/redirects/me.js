(async () => {
    try {
        const token = localStorage.getItem('auth');
        const response = await fetch("http://localhost:8081/api/user/logged-in", {
            headers: { 'x-access-token': token }
        });

        if (response.status != 200) {
            window.location.href = '/auth';
            return;
        }

        const responseData = await response.json();
        console.log(responseData)
        const responseUser = await fetch(`http://localhost:8081/api/user/${responseData.id}`);

        if(responseUser.status == 200){
            const responseUserData = await responseUser.json();
            const userFullName = document.getElementById('userFullName');
            const userImage = document.getElementById('userImage');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');

            userFullName.innerText = responseUserData.firstName + responseUserData.lastName;
            userImage.src = responseUserData.image ?? '/img/chefProfilePicture.png';
            userName.innerText = responseUserData.username;
            userEmail.innerText = responseUserData.email;
            document.title = `${responseUserData.lastName}' profile`;

            document.getElementById('container').classList.remove('d-none');
            document.getElementById('footer').classList.remove('d-none');
        }

    } catch (err) {
        console.error(err);
    }
})();