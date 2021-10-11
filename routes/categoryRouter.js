const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create Category
router.route('/category/search')
    .post(auth, authAdmin,categoryController.searchCategories);
router.route('/category')
    .get(categoryController.getCategories)
    .post(auth, authAdmin,categoryController.createCategory);

// delete update category
router.route('/category/:id')
    .get(auth, authAdmin, categoryController.getCategory)
    .delete(auth, authAdmin,categoryController.deleteCategory)
    .put(auth, authAdmin,categoryController.updateCategory)


module.exports = router;