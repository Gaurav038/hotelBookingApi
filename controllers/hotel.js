import Hotel from "../models/Hotel.js";


export const createHotel = async(req, res, next) => {
    const newHotel = new Hotel(req.body)

    try {
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    } catch (error) {
        next(error)
    }
}


export const getHotel = async(req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
        res.status(200).json(hotel)
    }  catch (error) {
        next(error)
    }
}

export const getAllHotel = async(req, res, next) => {
 const {min, max, limit, people, ...others} = req.query
        try {
            var Hotels;
            if(others.city){
              Hotels = await Hotel.find({
                        city: {$regex: new RegExp('^'+ others.city, "i") },
                        cheapestPrice: {$gte: min || 1, $lte: max || 12000},
                        maxPeople : {$gte: people}
                }).limit(limit);
            }
            else if(others.type){
                Hotels = await Hotel.find({type: others.type});
            }
            else if(people){
                Hotels = await Hotel.find({
                    cheapestPrice: {$gte: min || 1, $lte: max || 12000},
                    maxPeople : {$gte: people}
                })
            }
            else{
                Hotels = await Hotel.find()
            }
            
            res.status(200).json(Hotels)
        }  catch (error) {
            next(error)
        }
    
}

export const countByCity = async(req, res, next) => {

    const cities = req.query.cities.split(",")
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({city: city})
        }))
        res.status(200).json(list)
    }  catch (error) {
        next(error)
    }
}

export const countByType = async(req, res, next) => {
    
    try {
        const hotelCount = await Hotel.countDocuments({type: "hotel"})
        const apartmentCount = await Hotel.countDocuments({type: "apartment"})
        const resortCount = await Hotel.countDocuments({type: "resort"})
        const villaCount = await Hotel.countDocuments({type: "villa"})
        const cabinCount = await Hotel.countDocuments({type: "cabin"})

        res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartment", count: apartmentCount },
            { type: "resort", count: resortCount },
            { type: "villa", count: villaCount },
            { type: "cabin", count: cabinCount },
          ]);
    }  catch (error) {
        next(error)
    }
}

export const totalHotel = async(req, res, next) => {
    try {
      const hotelCount = await Hotel.countDocuments();
      res.status(200).json(hotelCount)
    } catch (error) {
        next(error)
    }
}


export const updateHotelAvailability = async (req, res, next) => {
    try {
      await Hotel.updateOne(
        { "_id": req.params.id },
        {
          $push: {
            "rooms_unavailableDates": req.body.dates
          },
        }
      );
      res.status(200).json("Room status has been updated.");
    } catch (err) {
      next(err);
    }
  };