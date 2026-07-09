const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const { isConnected } = require('../Models/db');

const fallbackUsers = new Map();

const getUserByEmail = async (email) => {
    if (isConnected()) {
        return UserModel.findOne({ email });
    }

    return fallbackUsers.get(email?.toLowerCase()) || null;
};

const createUser = async (userData) => {
    if (isConnected()) {
        const userModel = new UserModel(userData);
        await userModel.save();
        return userModel;
    }

    const normalizedEmail = userData.email.toLowerCase();
    if (fallbackUsers.has(normalizedEmail)) {
        throw new Error('User already exists');
    }

    const createdUser = {
        ...userData,
        _id: `memory-${Date.now()}`,
        email: normalizedEmail,
    };

    fallbackUsers.set(normalizedEmail, createdUser);
    return createdUser;
};

const signup = async(req, res) => {
    try {
        const {name, email, password} = req.body || {};
        const normalizedEmail = email?.toLowerCase();

        if (!name || !normalizedEmail || !password) {
            return res.status(400).json({ message: 'name, email and password are required', success: false });
        }

        const user = await getUserByEmail(normalizedEmail);
        if(user) {
            return res.status(409)
                .json({message: 'User is already exist, you can login', success: false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = await createUser({name, email: normalizedEmail, password: hashedPassword});

        res.status(201)
            .json({
                message: "Signup Successfully",
                success: true,
                mode: isConnected() ? 'database' : 'memory'
            })
    } catch(err) {
        console.error('Signup error:', err);
        res.status(500)
            .json({
                message: err.message || "Internal server error",
                success: false
            })
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body || {};
        const normalizedEmail = email?.toLowerCase();
        const user = await getUserByEmail(normalizedEmail);
        const errorMsg = 'Auth failed email or password is wrong';
        if(!user) {
            return res.status(403)
                .json({message: errorMsg, success: false});
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual) {
            return res.status(403)
                .json({message: errorMsg, success: false});
        }

        const jwtSecret = process.env.JWT_SECRET || 'dev-jwt-secret';
        const jwtToken = jwt.sign(
            {email: user.email, _id: user._id},
            jwtSecret,
            {expiresIn: '24h'}
        )
        res.status(200)
            .json({
                message: "Login Success..",
                success: true,
                jwtToken,
                email: normalizedEmail,
                name: user.name
            })
    } catch(err) {
        console.error('Login error:', err);
        res.status(500)
            .json({
                message: err.message || "Internal server error",
                success: false
            })
    }
}

module.exports = {
    signup,
    login
}
