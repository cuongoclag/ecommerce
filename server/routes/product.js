import express from 'express'
import { isAdmin, verifyToken } from './../middlewares/verifyToken.js'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.js'

const router = express.Router()

router.post('/', [verifyToken, isAdmin], createProduct)
router.get('/', getProducts)
router.put('/:id', [verifyToken, isAdmin], updateProduct)
router.delete('/:id', [verifyToken, isAdmin], deleteProduct)
router.get('/:id', getProduct)


export default router