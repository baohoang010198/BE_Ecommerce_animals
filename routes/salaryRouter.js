const router = require('express').Router();
const salaryController = require('../controllers/salaryController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create Category
router.route('/salary/search')
    .post(salaryController.getSalarys);

router.route('/salary/export')
    .post(salaryController.exportSalary)
    // .post(auth, authAdmin,salaryController.getAttendances

module.exports = router;