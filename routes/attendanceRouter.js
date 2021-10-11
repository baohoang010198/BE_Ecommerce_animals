const router = require('express').Router();
const attendanceController = require('../controllers/attendanceController');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create Category
router.route('/attendance/search')
    .post(attendanceController.getAttendances)
    // .post(auth, authAdmin,attendanceController.getAttendances
router.route('/attendance/')
    .post(attendanceController.createAttendance);
    // .post(auth, authAdmin,attendanceController.createAttendance);
// delete update category
router.route('/attendance/:id')
    .delete(attendanceController.deleteAttendance);
    // .delete(auth, authAdmin, attendanceController.deleteAttendance);

module.exports = router;