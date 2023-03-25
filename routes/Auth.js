const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


//REGISTER 
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });

    try {
        const savedUser = await newUser.save();
        const accessToken = jwt.sign(
            {
                id: savedUser._id,
                isAdmin: savedUser.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        );

        const { password, ...others } = savedUser._doc;

        res.status(201).json({...others, accessToken})
    } catch(err) {
        res.status(500).json(err);
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        );

        const { password, ...others } = user._doc;
        if(!user || OriginalPassword != req.body.password) {
            return res.status(400).json("wrong credentials")
        } else {
            return res.status(200).json({...others, accessToken});
        }
    } catch(err) {
        return res.status(500).json(err);
    }
})

module.exports = router;