const router = require('express').Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// GOOGLE
// router.get('/login-success/:id', userController.loginSuccess);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', (req,res,next) => {
    passport.authenticate('google', (err, user) => {
        req.user = user;
        next();
    })(req,res,next)
}, userController.loginSuccess
// (req,res) => {
//     // res.status(200).json({ user: req.user, accessToken: req.accessToken});
//     res.redirect(`http://localhost:3000/api/auth/login-success/${req.user.id}`);
// }
);

// FACEBOOK
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/facebook/callback', (req,res,next) => {
    passport.authenticate('facebook', (err, user) => {
        req.user = user;
        next();
    })(req,res,next)
}, userController.loginSuccess);

module.exports = router;