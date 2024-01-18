const redirectAccount = async () => {
    const token = localStorage.getItem('auth');

    if (!token) {
        window.location.href = '/auth';
        return;
    }

    window.location = '/try-auth?token=' + token;
};
