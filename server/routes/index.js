import { errHandler, notFound } from '../middlewares/errHandler.js'
import userRouter from './user.js'
import productRouter from './product.js'

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use(notFound)
    app.use(errHandler)
}

export default initRoutes