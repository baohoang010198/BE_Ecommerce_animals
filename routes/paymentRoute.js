const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create payment
router.route('/payment')
    .get(auth,authAdmin,paymentController.getPayments)
    .post(auth,paymentController.createPayment);

// delete update payment
// router.route('/payment/:id')
//     .delete(auth, authAdmin, paymentController.deleteCategory)
//     .put(auth, authAdmin, paymentController.updateCategory)


module.exports = router;