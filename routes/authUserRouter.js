const router = require('express').Router();
const authUserController = require('../controllers/authUserController');
const auth = require('../middleware/auth');


router.post('/register', authUserController.register);

router.post('/login', authUserController.login);

router.get('/logout', authUserController.logout);

router.get('/refresh_token', authUserController.refreshToken);

router.get('/info',auth, authUserController.getUser);

router.patch('/addcart',auth, authUserController.addCart);

router.get('/history',auth, authUserController.history);

router.put('/change-password',auth, authUserController.changPassword);

module.exports = router;