const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find({}).sort("createdAt");
    res.status(StatusCodes.OK).json({ blogs, count: blogs.length });
};

const getBlog = async (req, res) => {
    const {
        params: { id: blogId },
    } = req;
    const blog = await Blog.findOne({
        _id: blogId,
    });
    if (!blog) {
        throw new NotFoundError(`No blog with id ${blogId}`);
    }
    res.status(StatusCodes.OK).json(blog);
};

const createBlog = async (req, res) => {
    if (req.user.role !== 'Publisher') {
        throw new BadRequestError("Only publishers can create blogs.");
    }
    const blog = await Blog.create({
        ...req.body,
        author: req.user.name,
        createdBy: req.user.userId,
    });
    res.status(StatusCodes.CREATED).json(blog);
};

const updateBlog = async (req, res) => {
    const {
        body: { title, description, content },
        user: { userId },
        params: { id: blogId },
    } = req;
    if (title === undefined && description === undefined && content === undefined) {
        throw new BadRequestError("Please provide at least one field to update.");
    }
    const blog = await Blog.findByIdAndUpdate(
        { _id: blogId, createdBy: userId },
        req.body,
        { new: true, runValidators: true },
    );
    if (!blog) {
        throw new NotFoundError(`No blog with id ${blogId}`);
    }
    res.status(StatusCodes.OK).json(blog);
};

const deleteBlog = async (req, res) => {
    const {
        user: { userId },
        params: { id: blogId },
    } = req;
    const blog = await Blog.findByIdAndDelete({
        _id: blogId,
        createdBy: userId,
    });
    if (!blog) {
        throw new NotFoundError(`No blog with id ${blogId}`);
    }
    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
};

const likeBlog = async (req, res) => {
    const {
        user: { userId },
        params: { id: blogId },
    } = req;

    const blog = await Blog.findOneAndUpdate(
        { _id: blogId, 'likes.0': { $ne: userId } },
        { $push: { likes: userId } },
        { new: true }
    );

    if (!blog) {
        throw new NotFoundError(`No blog with id ${blogId}`);
    }

    res.status(StatusCodes.OK).json(blog);
};

const getUserBlogs = async (req, res) => {
    const {
        user: { userId },
    } = req;
    const blogs = await Blog.find({ createdBy: userId });
    res.status(StatusCodes.OK).json({ blogs, count: blogs.length });
};

module.exports = {
    getAllBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    getUserBlogs,
};
