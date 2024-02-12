const express = require("express");
const router = express.Router();
const auth = require("../middleware/authentication");

// /api/v1/blogs

const {
    getAllBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    getUserBlogs,
} = require("../controllers/blogsController");

router.route("/").get(getAllBlogs).post(auth, createBlog);
router.route("/:id").get(getBlog).patch(auth, updateBlog).delete(auth, deleteBlog);

router.route("/:id/like").patch(auth, likeBlog);
router.route("/user/:id").get(auth, getUserBlogs);

module.exports = router;