import express from "express";
import { createbooking } from "../controllers/booking.js";


const router = express.Router()

router.post("/createBooking", createbooking)

export default router;