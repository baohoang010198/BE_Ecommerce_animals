const router = require('express').Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create products
router.route('/products')
    .get(productController.getProducts)
    .post(productController.createProduct);

// delete update products 
router.route('/products/:id')
    .delete(productController.deleteProduct)
    .put(productController.updateProduct)


module.exports = router;