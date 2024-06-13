const User = require('../models/User');
const Conversation = require('../models/Conversation');

const homeController = {
    showHome: async (req,res) => {
        try {
            const loggedInUser = await User.findById(req.user.id);
            const users = await User.find({
                $and: [
                    { _id: { $nin: loggedInUser.likes.concat(loggedInUser.dislikes, req.user.id) } },
                    { gender: { $ne: loggedInUser.gender } }
                ]
            });
            return res.status(200).json(users);
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    likeUser: async (req,res) => {
        try {
            const loggedInUser = await User.findById(req.user.id);
            const likedUser = await User.findById(req.body.likeUserId);
            if (likedUser.likes.includes(req.user.id)) {
                loggedInUser.likes.push(req.body.likeUserId);
                loggedInUser.matches.push(req.body.likeUserId);
                likedUser.matches.push(req.user.id);
                await loggedInUser.save();
                await likedUser.save();
                // return res.status(200).json("It's match !!");
                const isConvoAlreadyCreated = await Conversation.findOne({ members: { $all: [req.user.id, req.body.likeUserId] } });
                if (!isConvoAlreadyCreated) {
                    await Conversation.create({ members: [req.user.id, req.body.likeUserId] });
                }
                return res.status(200).json({ message: "It's match !!", matched: true });
            } else {
                loggedInUser.likes.push(req.body.likeUserId);
                await loggedInUser.save();
                // return res.status(200).json("User liked successfully");
                return res.status(200).json({ message: "User liked successfully", matched: false });
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    dislikeUser: async (req,res) => {
        try {
            const loggedInUser = await User.findById(req.user.id);
            loggedInUser.dislikes.push(req.body.dislikeUserId);
            await loggedInUser.save();
            return res.status(200).json("User disliked successfully");
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    getImage: async (req,res) => {
        try {
            const loggedInUser = await User.findById(req.user.id);
            const imgUser = await User.find({
                $and: [
                    { _id: { $nin: loggedInUser.likes.concat(loggedInUser.dislikes, req.user.id) } },
                    { gender: { $ne: loggedInUser.gender } }
                ]
            }).select("image");
            return res.status(200).json(imgUser);
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}

module.exports = homeController;