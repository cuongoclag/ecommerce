import { asyncHandler } from 'express-async-handler';
import { slugify } from 'slugify'
import Product from '../models/product'

export const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Can not create new product'
    })
})

export const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Can not get product' 
    })
})

export const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
    return res.status(200).json({
        success: products ? true : false,
        productData: products ? products : 'Can not get products' 
    })
})

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
    return res.status(200).json({
        success: product ? true : false,
        updatedProduct: product ? product : 'Can not update product' 
    })
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)
    return res.status(200).json({
        success: product ? true : false,
        deletedProduct: product ? product : 'Can not delete product' 
    })
})