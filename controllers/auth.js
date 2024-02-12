const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
    const { accountKey, ...rest } = req.body; // Extract keys from the request body

    let isAdmin = false;
    let role = 'User';

    if (accountKey === process.env.ADMIN_KEY) {
        console.log("registering an admin user...");
        isAdmin = true;
    }
    if (accountKey === process.env.PUBLISHER_KEY) {
        console.log("registering a publisher user...");
        role = 'Publisher';
    }

    const user = await User.create({ ...rest, isAdmin, role })
        .catch((error) => {
            if(error.code === 11000) {
                throw new BadRequestError("User with that email already exists.");
            }
        });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password.");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError("Invalid credentials.");
    }

    const passwordCorrect = await user.comparePasswords(password);
    if (!passwordCorrect) {
        throw new UnauthenticatedError("Invalid credentials.");
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
    register,
    login,
};
