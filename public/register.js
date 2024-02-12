document.getElementById('add-account-key').addEventListener('click', () => {
    document.getElementById('account-key-cont').style.display = 'block';
});

document.getElementById('register-button').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password-confirmation').value;
    const accountKey = document.getElementById('account-key').value;
    const info = document.getElementById('form-info');

    if (name && email && password && passwordConfirmation) {
        if (password === passwordConfirmation) {
            const data = {
                name,
                email,
                password,
                accountKey
            };

            fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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
        } else {
            info.textContent = 'Passwords do not match';
        }
    } else {
        info.textContent = 'Please fill in all fields';
    }
});

document.getElementById('register-cancel').addEventListener('click', () => {
    window.location.href = '/';
});