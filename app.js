// Standard and Third-Party Modules
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require('path');

// Local Modules
const authRouter = require("./routes/authRouter");
const blogsRouter = require("./routes/blogsRouter");
const dbConnect = require("./db/connect");
//Left in for clarity, but the auth middleware is implemented in the blogsRouter.js file
const auth = require("./middleware/authentication");
const notFound = require("./middleware/not-found");

// Express Application Setup
const app = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Security Configuration
app.use(helmet());
app.use(cors());
app.use(xssClean());
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Public routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.get('/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/blogs.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/register.html'));
});
app.get('/blogs/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/blog.html'));
});


// Route Definitions
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", blogsRouter);

// Error Handling
app.use(notFound);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
    console.log(err);
});

// Server Initialization
const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await dbConnect(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Listening on port ${port}...\nYour localhost address is http://localhost:${port}`));
    } catch (err) {
        console.error(err);
    }
};

start();