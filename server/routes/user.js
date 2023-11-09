import express from 'express'
import { login, register, getUser, refreshAccessToken, logout, getUsers, deleteUser, updateUser, updateUserByAdmin } from '../controllers/user.js'
import { isAdmin, verifyToken } from './../middlewares/verifyToken.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/current', verifyToken, getUser)
router.post('/refreshToken', refreshAccessToken)
router.post('/logout', logout)
router.get('/', [verifyToken, isAdmin], getUsers)
router.delete('/', [verifyToken, isAdmin], deleteUser)
router.put('/current', verifyToken, updateUser)
router.put('/:_id', [verifyToken, isAdmin], updateUserByAdmin)

export default router