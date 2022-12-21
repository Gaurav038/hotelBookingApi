import express from "express";
import { createHotel, deleteHotel, getAllHotel, getHotel, updateHotel } from "../controllers/hotel.js";
const router = express.Router()

// CREATE
router.post("/", createHotel);

// UPDATE
router.put("/:id", updateHotel)

// get single
router.get("/:id", getHotel)


// get All
router.get("/", getAllHotel)


// DELETE
router.delete("/:id", deleteHotel)

export default router