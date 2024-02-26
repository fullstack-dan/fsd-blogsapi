const blogPostContainer = document.getElementById('blog-post-container');
const blogEditForm = document.getElementById('blog-edit-form');


const url = new URL(window.location.href);
const pathSegments = url.pathname.split('/');
const blogId = pathSegments[pathSegments.length - 1];
fetch(`/api/v1/blogs/${blogId}`)
    .then(response => response.json())
    .then(blog => {
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
                .then(blog => {
                    likeButton.innerHTML = `Liked by ${blog.likes.length} user${blog.likes.length === 1 ? '' : 's'}`;
                    likeButton.disabled = true;
                })
                .catch(error => {
                    console.log('There was a problem with the fetch operation: ' + error.message);
                });
        });
        blogPostContainer.appendChild(likeButton);
        return blog;
    }
}).then((blog) => {
    if (localStorage.getItem('token')) {

        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decodedToken = JSON.parse(atob(base64));
        if (decodedToken.userId === blog.createdBy) {
            const deleteButton = document.createElement('button');
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

            const editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.addEventListener('click', () => {
                blogPostContainer.style.display = 'none';
                blogEditForm.style.display = 'flex';
                document.getElementById('edit-blog-title').value = blog.title;
                document.getElementById('edit-blog-description').value = blog.description;
                document.getElementById('edit-blog-content').value = blog.content;

                const cancelEditBlogBtn = document.getElementById('cancel-edit-blog-btn');
                cancelEditBlogBtn.addEventListener('click', () => {
                    blogPostContainer.style.display = 'block';
                    blogEditForm.style.display = 'none';
                });

                const submitEditBlogBtn = document.getElementById('submit-edit-blog-btn');
                submitEditBlogBtn.addEventListener('click', async () => {
                    const title = document.getElementById('edit-blog-title').value;
                    const description = document.getElementById('edit-blog-description').value;
                    const content = document.getElementById('edit-blog-content').value;
                    const info = document.getElementById('edit-blog-info');

                    if (!title || !description || !content) {
                        info.textContent = 'Please fill in all fields';
                        return;
                    }

                    const response = await fetch(`/api/v1/blogs/${blogId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ title, description, content })
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        info.textContent = data.message;
                    } else {
                        window.location.href = `/blogs/${blogId}`;
                    }
                });
            });


            blogPostContainer.appendChild(deleteButton);
            blogPostContainer.appendChild(editButton);
        }
    }
});




