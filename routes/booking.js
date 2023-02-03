import express from "express";
import { cancelBooking, createbooking, getAllBooking, getBookingByUserId, totalBooking } from "../controllers/booking.js";
import { verifyAdmin } from "../utils/verifyToken.js";


const router = express.Router()

router.get("/", verifyAdmin, getAllBooking)
router.post("/createBooking", createbooking)
router.post("/getbookingbyuserid", getBookingByUserId)
router.post("/cancelbooking", cancelBooking)
router.get("/count", totalBooking)


export default router;