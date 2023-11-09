import jwt from 'jsonwebtoken'
import { asyncHandler } from 'express-async-handler'

export const verifyToken = asyncHandler(async(req, res, token) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) return res.status(401).json({
                success: false,
                message: 'Invalid accesstoken'
            })

            req.user = decode
            next()
        })
    } else {
        return res.status(401).json({
            success: false,
            message: 'Require authentication'
        })
    }
})

export const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user
    if (role !== 'admin') return res.status(401).json({
        success: false,
        message: 'Require admin'
    })
    next()
})