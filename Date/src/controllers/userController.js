const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authService = require('../services/authService');

let refreshTokens = []

const redis = require('redis');
const redisClient = redis.createClient();

const userController = {
    // REGISTER
    registerUser: async (req,res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const dateOfBirth = new Date(req.body.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dateOfBirth.getFullYear();
            const birthdayThisYear = new Date(today.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate());
            if (today < birthdayThisYear) {
                age--;
            }
            let newUser = await new User({
                username: req.body.username,
                name: req.body.name,
                gender: req.body.gender,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                dateOfBirth: req.body.dateOfBirth,
                age: age,
                password: hashed,
            });
            const user = await newUser.save();
            return res.status(200).json(user);
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
        }, process.env.JWT_ACCESS_KEY, {expiresIn: '2d'});
    },
    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
        }, process.env.JWT_REFRESH_KEY, {expiresIn: '365d'});
    },
    // LOGIN
    loginUser: async (req,res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Wrong username");
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }
            if (user && validPassword) {
                const accessToken = userController.generateAccessToken(user);
                const refreshToken = userController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                // redisClient.sAdd('refreshTokens', refreshToken);
                // lưu refresh token vào cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict'
                });
                const { password, ...others } = user._doc;
                return res.status(200).json({ others, accessToken });
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    // REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("You're not authenticated");
        }
        if (!refreshTokens.includes(refreshToken)) {
            res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            } 
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            // tạo mới access token, refresh token
            const newAccessToken = userController.generateAccessToken(user);
            const newRefreshToken = userController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
        // redisClient.sIsMember('refreshTokens', refreshToken, (err, reply) => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     if (reply === 0) {
        //         return res.status(403).json("Refresh token is not valid");
        //     }
        //     jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        //         if (err) {
        //             console.log(err);
        //         }
        //         redisClient.sRem('refreshTokens', refreshToken);
        //         // tạo mới access token, refresh token
        //         const newAccessToken = userController.generateAccessToken(user);
        //         const newRefreshToken = userController.generateRefreshToken(user);
        //         // lưu refresh token mới vào redis
        //         redisClient.sAdd('refreshTokens', newRefreshToken);
        //         res.cookie('refreshToken', newRefreshToken, {
        //             httpOnly: true,
        //             secure: false,
        //             path: '/',
        //             sameSite: 'strict',
        //         });
        //         return res.status(200).json({ accessToken: newAccessToken });
        //     });
        // })
    },
    logOut: async (req, res) => {
        // const refreshToken = req.cookies.refreshToken;
        // xóa refresh token khỏi redis
        // redisClient.srem('refreshTokens', refreshToken);
        res.clearCookie('refreshToken');
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.status(200).json("Log out successfully");
    },
    // PROFILE
    profileUser: async (req,res) => {
        try {
            if (req.user.id === req.params.id) {
                let user = await User.findOne({ _id: req.params.id });
                if (req.files) {
                    const bio = req.body.bio;
                    let path = '';
                    req.files.forEach(function (files, index, arr) {
                        path = path + files.path + ',';
                    });
                    path = path.substring(0, path.lastIndexOf(','));
                    user.image = path;
                    user = await User.findOneAndUpdate({ _id: req.params.id }, { image: path, bio: bio }, { new: true });
                }
                return res.status(200).json(user);
            } else {
                return res.status(403).json("You're not allowed");
            }
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    loginSuccess: async (req,res) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json("You're not authenticated");
            } else {
                const accessToken = userController.generateAccessToken(user);
                const refreshToken = userController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                // lưu refresh token vào cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict'
                });
                return res.status(200).json({ user, accessToken });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    getUser: async (req,res) => {
        try {
            const user = await User.findOne({ _id: req.params.id })
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = userController;