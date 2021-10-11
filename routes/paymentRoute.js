const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create payment
router.route('/payment/search')
    .post(paymentController.searchPayments);
    // .post(auth,authAdmin,paymentController.getPayments)
router.route('/payment/export')
    .post(paymentController.exportPayment);

router.route('/payment/')
    .post(auth,paymentController.createPayment);
// delete update payment
router.route('/payment/:id')
    .get(paymentController.getPayment)
    .put(paymentController.updatePayment)
    .delete(paymentController.deletePayment);
    // .put(auth, authAdmin, paymentController.updateStatusPayment);

module.exports = router;