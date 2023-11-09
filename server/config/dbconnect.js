import mongoose from 'mongoose'

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        if (connection.connection.readyState === 1) console.log('DB connection is successfully ')
        else console.log('DB connection is failed')
    } catch (error) {
        console.log('DB connection is failed')
        throw new Error(error)
    }
}
export default dbConnect