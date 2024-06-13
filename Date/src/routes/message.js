const messageController = require('../controllers/messageController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/:convoId', middlewareController.verifyToken, messageController.getAllMessage);
router.post('/', middlewareController.verifyToken, messageController.sendMessage);

module.exports = router;
