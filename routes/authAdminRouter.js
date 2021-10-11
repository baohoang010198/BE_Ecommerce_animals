const router = require('express').Router();
const authAdminController = require('../controllers/authAdminController');
const auth = require('../middleware/auth');

router.post('/login', authAdminController.login);

router.get('/logout', authAdminController.logout);

router.get('/refresh_token', authAdminController.refreshToken);

// router.get('/info',auth, adminController.getUser);

// router.get('/history',auth, adminController.history);

router.post('/', authAdminController.create);

module.exports = router;