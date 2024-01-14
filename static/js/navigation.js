const redirectAccount = async () => {
    const token = localStorage.getItem('auth');

    if (!token) {
        window.location.href = '/auth';
    }

    try {
        const response = await fetch('http://localhost:8081/api/user/auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        });

        const data = await response.json();
        console.log(data)
        if (response.ok) {
            const id = data.id;
            window.location.href = `/me/${id}`;
        } else {
            window.location.href = '/auth';
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
};
