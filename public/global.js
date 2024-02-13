const navbar = document.createElement('nav');

let user = null;

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = '/styles.css';
document.head.appendChild(stylesheet);


if(localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedToken = JSON.parse(atob(base64));
    user = decodedToken.name;
}

navbar.innerHTML = `
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/blogs">View Blogs</a></li>
    </ul>
    <div id="user-info">
        ${
            user ? 
                `
                <p>Hello, ${user}</p> 
                <button id="logout-btn">Log out</button>
                ` :
                `
                <a href="/login">Login</a>
                <a href="/register">Register</a>
                `
        }
    </div>
`;

document.body.insertBefore(navbar, document.body.firstChild);

if (user) {
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        location.href = '/';
    });
}