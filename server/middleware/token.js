const jwt = require("jsonwebtoken");

const CreateToken = ({ id, type }) => {
    const accessToken = jwt.sign({ id },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: type === "signin" ? '20d' : '5d' });
    return { accessToken };
}
module.exports = { CreateToken }