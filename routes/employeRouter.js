const router = require('express').Router();
const employeController = require('../controllers/EmployeController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create Category
router.route('/employe/search')
    .post(employeController.getEmployes);
    // .get(auth, authAdmin,employeController.getEmployes);
router.route('/employe')
    .post(employeController.createEmploye);
    // .post(auth, authAdmin,employeController.createEmploye);

// delete update category
router.route('/employe/:id')
    .get( employeController.getEmploye)
    .delete( employeController.deleteEmploye)
    .put( employeController.updateEmploye)
    // .get(auth, authAdmin, employeController.getInfoEmploye)
    // .delete(auth, authAdmin, employeController.deleteEmploye)
    // .put(auth, authAdmin, employeController.updateEmploye)


module.exports = router;