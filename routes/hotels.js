import express from "express";
import { countByCity, countByType, createHotel, getAllHotel, getFavHotel, getHotel, totalHotel ,updateHotelAvailability } from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router()

// CREATE
router.post("/",verifyAdmin, createHotel);

// get single
router.get("/find/:id", getHotel)

// get All
router.get("/", verifyAdmin, getAllHotel)

router.get("/count", totalHotel)

router.get("/countByCity", countByCity)
router.get("/countByType", countByType)
router.put("/availability/:id", updateHotelAvailability)
router.get("/favtHotel", getFavHotel)







export default router