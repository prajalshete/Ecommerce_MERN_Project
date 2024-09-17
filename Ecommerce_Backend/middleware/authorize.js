//import jwt from "jsonwebtoken";
const jwt = require('jsonwebtoken');
// import dotenv from "dotenv";
// import userModel from "../model/user.model.js";
// dotenv.config();
const secretKey = 'prajal';


exports.auth = (req, res, next) => {
    let token = req.header('Authorization');
    console.log(token);
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token,secretKey);
        console.log('Decoded token:', decoded); 
        req.user = decoded.user;
        console.log('User extracted from token:', req.user);
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

exports.admin = (req, res, next) => {
    console.log('req.user.role',req.user.role)
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied, admin only' });
    }
    next();
};