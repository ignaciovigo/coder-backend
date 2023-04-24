import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
  console.log('Connection to the database successfully!')
}).catch((err) => {
  console.log('Connection Error: ', err)
})

export default mongoose
