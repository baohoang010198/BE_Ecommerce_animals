const router = require('express').Router();

const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
// router.get('/info',auth, adminController.getUser);

// router.get('/history',auth, adminController.history);

router.route('/admin/search')
    .post(adminController.searchAdmins);
    // .post(auth, authAdmin,adminController.searchAdmins);
router.route('/admin')
    // .post(adminController.createAdmin);
    .post(auth, authAdmin,adminController.createAdmin);
// delete update category
router.route('/admin/:id')
    .get(auth, authAdmin,adminController.getAdmin)  
    .delete( auth, authAdmin,adminController.deleteAdmin)
    .put( auth, authAdmin,adminController.updateAdmin);

router.route('/admin/change-password/:id')
    .put( auth, authAdmin,adminController.changeAdmin)
    // .get(adminController.getAdmin)  
    // .delete( adminController.deleteAdmin)
    // .put( adminController.updateAdmin);

module.exports = router;