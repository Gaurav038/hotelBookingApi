import mongoose from "mongoose";
const {Schema} = mongoose

const HotelSchema = new Schema({
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      distance: {
        type: String,
        required: true,
      },
      photos: {
        type: [String],
      },
      title: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
      maxPeople: {
        type: Number,
        required: true
      },
      rooms_unavailableDates: {
        type: [Date]
      },
      currentbookings: []
      ,
      cheapestPrice: {
        type: Number,
        required: true,
      },
      featured: {
        type: Boolean,
        default: false,
      },
})

export default mongoose.model("Hotels", HotelSchema);