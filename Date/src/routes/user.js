const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');

const router = require('express').Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refresh', userController.requestRefreshToken);
router.post('/logout', middlewareController.verifyToken, userController.logOut);
router.post('/:id', middlewareController.verifyToken, upload.array('image'), userController.profileUser);
router.get('/find/:id', userController.getUser);

module.exports = router;