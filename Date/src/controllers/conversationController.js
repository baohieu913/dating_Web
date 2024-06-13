const Conversation = require('../models/Conversation');
const User = require('../models/User');

const conversationController = {
    // create conversation
    createConversation: async (req,res) => {
        try {
            const currentUserId = req.user.id;
            const currentUser = await User.findById(currentUserId);
            for (const matchesUsers of currentUser.matches) {
                const matchesUsersString = matchesUsers.toString();
                // await Conversation.create({ members: [currentUserId, matchesUsersString] });
                const isConvoAlreadyCreated = await Conversation.findOne({ members: { $all: [matchesUsersString, currentUserId ]} } );
                if (isConvoAlreadyCreated) {
                    return res.status(500).json("There is already such conversation");
                } else {
                    await Conversation.create({members: [currentUserId, matchesUsersString]});
                    return res.status(200).json("Conversation is successfully created");
                }
            }
            return res.status(200).json("Conversations are successfully created");
        } catch(err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // get user conversation with its ID
    getUserConversation: async (req,res) => {
        if(req.user.id  === req.params.userId){
            try {
                const userId = req.user.id
                const conversations = await Conversation.find({members: {$in: [userId]}})
                return res.status(200).json(conversations)
            } catch (error) {
                return res.status(500).json(err)
            }
        } else {
            return res.status(403).json("You can get only your own conversations")
        }
    },
    // get a single conversation
    getAConversation: async (req,res) => {
        try {
            const conversation = await Conversation.findById(req.params.convoId);
            if (conversation.members.includes(req.user.id)) {
                return res.status(200).json(conversation);
            } else {
                return res.status(403).json("This conversation does not include you");
            }
        } catch(err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = conversationController;