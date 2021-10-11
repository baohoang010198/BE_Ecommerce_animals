const router = require('express').Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// router.get('/info',auth, adminController.getUser);

// router.get('/history',auth, adminController.history);

router.route('/user/search')
    .post(userController.searchUsers);

// delete update category
router.route('/user/:id')
    .delete( userController.deleteUser)
router.route('/user/change-password/:id')
    .put( userController.changePasswordUser)
    // .delete(auth, authAdmin, adminController.deleteUser)
    // .put(auth, authAdmin, adminController.updateUser)

module.exports = router;