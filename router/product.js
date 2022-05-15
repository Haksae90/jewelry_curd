import express from 'express';
const router = express.Router();
import upload from '../middleware/imageUpload.js';
import productValidation from '../middleware/validator.js'
import ProductController from './product.controller.js';

router.post('/', upload.fields([{ name: 'mainImage' }, { name: 'detailImage' }]), productValidation, ProductController.registerProduct);
router.get('/list', ProductController.getProductList);
router.route('/:productId')
  .get(ProductController.getProductDetail)
  .patch(upload.fields([{ name: 'mainImage' }, { name: 'detailImage' }]), productValidation, ProductController.modifyProduct)
  .delete(ProductController.deleteProduct);
router.post('/category', ProductController.registerCategory);

export default router;
