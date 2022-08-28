import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpLoad from 'express-fileupload'
import authRoute from './routes/auth.js'
import collectionRoute from './routes/collection.js'
import userRoute from './routes/user.js'
import themeRoute from './routes/theme.js'
import itemRoute from './routes/item.js'
import tagRoute from './routes/tag.js'
import corsMiddleware from "./middleware/cors.middleware.js";

const app = express()
dotenv.config()

const PORT = process.env.PORT || 5000
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(corsMiddleware)
app.use(cors())
app.use(fileUpLoad())
app.use(express.json())
app.use(express.static('uploads'))

app.use(`/api/auth`, authRoute)
app.use(`/api/collection`, collectionRoute)
app.use(`/api/item`, itemRoute)
app.use(`/api/users`, userRoute)
app.use(`/api/themes`, themeRoute)
app.use(`/api/tag`, tagRoute)

async function start(){
    try{
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.fgk5bri.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
        )

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }catch (e){
        console.log(e)
    }
}

start()