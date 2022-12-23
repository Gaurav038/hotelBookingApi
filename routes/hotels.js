import express from "express";
import { createHotel, deleteHotel, getAllHotel, getHotel, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router()

// CREATE
router.post("/",verifyAdmin, createHotel);

// UPDATE
router.put("/:id",verifyAdmin, updateHotel)

// get single
router.get("/:id", getHotel)


// get All
router.get("/", getAllHotel)


// DELETE
router.delete("/:id",verifyAdmin, deleteHotel)

export default router