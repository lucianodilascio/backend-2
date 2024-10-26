import jwt from "jsonwebtoken";

const private_key = "coderCookieToken";

const generateToken = (user) => {
    const token = jwt.sign(user, private_key, {expiresIn: "24h"}); 
    //se le puede poner fecha de expiración.
    return token;
}

export default generateToken;
