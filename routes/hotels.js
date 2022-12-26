import express from "express";
import { countByCity, countByType, createHotel, deleteHotel, getAllHotel, getHotel, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router()

// CREATE
router.post("/",verifyAdmin, createHotel);

// UPDATE
router.put("/:id",verifyAdmin, updateHotel)

// DELETE
router.delete("/:id",verifyAdmin, deleteHotel)

// get single
router.get("/find/:id", getHotel)

// get All
router.get("/find/", getAllHotel)

router.get("/countByCity", countByCity)
router.get("/countByType", countByType)






export default router