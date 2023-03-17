import express from "express" //-----for using es6 module "type module" in package ----
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import hotelRoute from "./routes/hotels.js"
import userRoute from "./routes/users.js"
import bookingRoute from "./routes/booking.js"
import cookieParser from "cookie-parser"
import cors from "cors";
import bodyParser from 'body-parser'

const PORT = process.env.PORT || 8000

const app = express()
dotenv.config()
mongoose.set("strictQuery", false);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_ADD)
        console.log("mongoDB Connected")
    } catch (error) {
        throw error;
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB DisConnected")
})

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200,
  }))
app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/hotels", hotelRoute)
app.use("/api/booking", bookingRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "something went Wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })

})

app.listen(PORT, () =>{
    connect()
    console.log("connected to backend yess !!!!!....", PORT)
})