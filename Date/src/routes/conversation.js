const conversationController = require('../controllers/conversationController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/:convoId', middlewareController.verifyToken, conversationController.getAConversation);
router.get('/find/:userId', middlewareController.verifyToken, conversationController.getUserConversation);
router.post('/', middlewareController.verifyToken, conversationController.createConversation);

module.exports = router;
