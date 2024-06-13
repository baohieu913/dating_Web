const Message = require('../models/Message');

const messageController = {
    // send message
    sendMessage: async (req,res) => {
        try {
            const { messageText, conversationId } = req.body;
            const newMessage = await Message.create({messageText, senderId: req.user.id, conversationId});
            return res.status(200).json(newMessage);
        } catch(err) {
            return res.status(500).json(err);
        }
    },
    // get all message from conversation
    getAllMessage: async (req,res) => {
        try {
            const messages = await Message.find({conversationId: req.params.convoId});
            return res.status(200).json(messages);
        } catch(err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = messageController;