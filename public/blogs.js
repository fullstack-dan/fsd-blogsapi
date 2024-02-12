fetch('/api/v1/blogs', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const blogs = data.blogs;
        const blogsDiv = document.querySelector('.blogs');
        blogs.forEach(blog => {
            const blogDiv = document.createElement('div');
            blogDiv.innerHTML = `<h2>${blog.title}</h2><p>${blog.content}</p>`;
            blogsDiv.appendChild(blogDiv);
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });