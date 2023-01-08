require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

app.post("/getToken", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
        const token = jwt.sign({ username }, 
        process.env.JWT_SECRET_KEY, {
            expiresIn: 86400
        });
        return res.json({ username, token, msg: "Generated token successfully" });
    }
    return res.json({ msg: "Invalid Credentials" });
});

const verifyTokenMiddleware = (req, res, next) => {
    const { token } = req.body;
    if (!token) return res.status(403).json({ 
        msg: "No token present" 
    });
    try {
        const decoded = jwt.verify(token, 
            process.env.JWT_SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ 
            msg: "Invalid Token" 
        });
    }
    next();
};

app.get("/getData", verifyTokenMiddleware, (req, res) => {
    const fs = require('fs');

    let rawdata = fs.readFileSync('book.json');
    let datajson = JSON.parse(rawdata);
    return res.send(datajson);
});

app.listen(8000, () => console.log("Listening on 8000"));
 