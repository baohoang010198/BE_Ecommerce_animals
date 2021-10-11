const router = require('express').Router();
const adviseController = require('../controllers/adviseController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create advise
router.route('/advise/search')
    // .post(auth, authAdmin,adviseController.searchAdvises);
    .post(adviseController.searchAdvises);
router.route('/advise')
    .post(adviseController.createAdvise);

// delete update advise
router.route('/advise/:id')
    // .get(auth, authAdmin, adviseController.getAdvise)
    // .put(auth, authAdmin,adviseController.updateAdvise)
    .get(adviseController.getAdvise)
    .put(adviseController.updateAdvise)


module.exports = router;