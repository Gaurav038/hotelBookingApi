import express from "express";
import { cancelBooking, createbooking, getAllBooking, getBookingByUserId } from "../controllers/booking.js";
import { verifyAdmin } from "../utils/verifyToken.js";


const router = express.Router()

router.get("/", verifyAdmin, getAllBooking)
router.post("/createBooking", createbooking)
router.post("/getbookingbyuserid", getBookingByUserId)
router.post("/cancelbooking", cancelBooking)

export default router;