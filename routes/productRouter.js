const router = require('express').Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


// get and create products
router.route('/products/search')
    .post(productController.getProducts);
router.route('/products')
    .post(productController.createProduct);

// delete update products 
router.route('/products/category/:id')
    .get(productController.getProductsCategory)
router.route('/products-featured')
    .get(productController.getProductsFeatured)
router.route('/products-latest')
    .get(productController.getProductsLatest)
router.route('/products/:id')
    .get(productController.getProduct)
    .delete(productController.deleteProduct)
    .put(productController.updateProduct)


module.exports = router;