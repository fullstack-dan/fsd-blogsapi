const blogPostContainer = document.getElementById('blog-post-container');
const url = new URL(window.location.href);
const pathSegments = url.pathname.split('/');
const blogId = pathSegments[pathSegments.length - 1];
fetch(`/api/v1/blogs/${blogId}`)
    .then(response => response.json())
    .then(data => {
        const blog = data.blog;
        blogPostContainer.innerHTML = `
        <h1>${blog.title}</h1>
        <h3>${blog.description}</h3>
        <p>By ${blog.author}</p>
        <p>${blog.content}</p>
        `;
        return blog;
    }).then((blog) => {
    if (localStorage.getItem('token')) {
        const likeButton = document.createElement('button');

        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decodedToken = JSON.parse(atob(base64));
        if (blog.likes.includes(decodedToken.userId)) {
            likeButton.innerHTML = `Liked by ${blog.likes.length} user${blog.likes.length === 1 ? '' : 's'}`;
            likeButton.disabled = true;
            blogPostContainer.appendChild(likeButton);
            return blog;
        }

        likeButton.innerHTML = 'Like';
        likeButton.addEventListener('click', () => {
            fetch(`/api/v1/blogs/${blogId}/like`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    likeButton.innerHTML = `Liked by ${data.blog.likes.length} user${data.blog.likes.length === 1 ? '' : 's'}`;
                    likeButton.disabled = true;
                })
                .catch(error => {
                    console.log('There was a problem with the fetch operation: ' + error.message);
                });
        });
        blogPostContainer.appendChild(likeButton);
    }
}).then((blog) => {
    if (localStorage.getItem('token')) {
        const deleteButton = document.createElement('button');

        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decodedToken = JSON.parse(atob(base64));
        if (decodedToken.userId === blog.createdBy) {
            deleteButton.innerHTML = 'Delete';
            deleteButton.addEventListener('click', () => {
                fetch(`/api/v1/blogs/${blogId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        window.location.href = '/';
                    })
                    .catch(error => {
                        console.log('There was a problem with the fetch operation: ' + error.message);
                    });
            });
            blogPostContainer.appendChild(deleteButton);
        }
    }
});

