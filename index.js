import express from "express" //-----for using es6 module "type module" in package ----
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import hotelRoute from "./routes/hotels.js"
import roomRoute from "./routes/rooms.js"
import userRoute from "./routes/users.js"
import cookieParser from "cookie-parser"
import cors from "cors";

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
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/hotels", hotelRoute)
app.use("/api/rooms", roomRoute)

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

app.listen(8000, () =>{
    connect()
    console.log("connected to backend !!!!!....")
})