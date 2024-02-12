document.getElementById('login-button').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const info = document.getElementById('form-info');

    if (!email || !password) {
        info.textContent = 'Please fill in all fields';
        return;
    }

    fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message);
                });
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        })
        .catch(error => {
            info.textContent = error.message;
        });
});

document.getElementById('login-cancel').addEventListener('click', function() {
    window.location.href = '/';
});