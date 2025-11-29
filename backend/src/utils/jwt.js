const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            accountId: user.accountId,
            role: user.role,
            name: user.name,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};

const verifyToken = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET);
};

module.exports = {generateToken,verifyToken};