const redirectAccount = () => {
    const token = localStorage.getItem('auth');

    if (!token) {
        window.location.href = '/auth';
        return;
    }

    window.location = '/try-auth?token=' + token;
};

const redirect = (page = '/auth') => {
    const token = localStorage.getItem('auth');

    if (!token) {
        window.location.href = '/auth';
        return;
    }

    window.location.href = `${page}?token=${token}`;
}

const removeTokenParam = () => {
    const newURL = `${window.location.pathname}`;
    history.pushState(null, '', newURL);
}
removeTokenParam();
