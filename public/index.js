
const getBlogs = async () => {
    const blogsList = document.getElementById('blogs-cont');
    const response = await fetch('/api/v1/blogs');
    const blogs = await response.json();
    const blogsArray = blogs.blogs;
    blogsList.innerHTML = '';

    blogsArray.forEach(blog => {
        let div = document.createElement('div');
        div.className = 'blog-card';
        div.innerHTML = `
            <h2><a href="/blogs/${blog._id}">${blog.title}</a></h2>
            <h3>${blog.description}</h3>
            <p>By ${blog.author}</p>
        `;

        blogsList.appendChild(div);
    });
};

const populatePublisherControls = () => {
    const publisherControls = document.getElementById('publisher-controls');

    if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decodedToken = JSON.parse(atob(base64));
        if (decodedToken.role === 'Publisher') {
            publisherControls.style.display = 'block';

            const createBlogBtn = document.getElementById('create-blog-btn');
            createBlogBtn.addEventListener('click', () => {
                document.getElementById('create-blog-form').style.display = 'flex';
            });

            const cancelCreateBlogBtn = document.getElementById('cancel-create-blog-btn');
            cancelCreateBlogBtn.addEventListener('click', () => {
                document.getElementById('create-blog-form').style.display = 'none';
            });

            const submitCreateBlogBtn = document.getElementById('submit-create-blog-btn');
            submitCreateBlogBtn.addEventListener('click', async () => {
                    const title = document.getElementById('create-blog-title').value;
                    const description = document.getElementById('create-blog-description').value;
                    const content = document.getElementById('create-blog-content').value;
                    const info = document.getElementById('create-blog-info');

                    if (!title || !description || !content) {
                        info.textContent = 'Please fill in all fields';
                        return;
                    }

                    const response = await fetch('/api/v1/blogs', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ title, description, content })
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        info.textContent = data.message;
                        // alert(data.message);
                    } else {
                        document.getElementById('create-blog-form').style.display = 'none';
                        document.getElementById('create-blog-title').value = '';
                        document.getElementById('create-blog-description').value = '';
                        document.getElementById('create-blog-content').value = '';
                        // console.log(data);
                        getBlogs();
                    }

                }
            );
        }
    } else {
        publisherControls.style.display = 'none';
    }
}

window.onload = () => {
    getBlogs();
    populatePublisherControls();
};