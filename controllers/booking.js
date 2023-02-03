import moment from "moment"
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid'
import Booking from '../models/Booking.js'
import Hotel from "../models/Hotel.js";

const stripe = new Stripe('sk_test_51JkQ5ESHQQudBiguqRq7JkJ8oamRAnL4NnSRETesVbZWZEXxh0Rja7czBbaYdbNA30YiR74guZMonHiQqHoGuISQ00FNUebZtw');

export const getAllBooking = async(req, res, next) => {
    try {
        const bookings = await Booking.find()
        res.status(200).json(bookings);
    } catch (error) {
        next(error)
    }
}

export const createbooking = async(req, res, next) => {
    try {
        const {room, userid, fromdate, todate, totalAmount, totaldays, token} = req.body
    
         try {
            //create customer
            const customer = await stripe.customers.create({
                email: token.email,
                source: token.id
            })

            //charge payment
            const payment = await stripe.charges.create({
                amount: totalAmount * 100,
                customer: customer.id,
                currency: 'inr',
                receipt_email: token.email
            }, {
                idempotencyKey: uuidv4()
            })

                  //Payment Success
            
            if(payment){
                try {
                    const newBooking = new Booking({
                        room : room.name,
                        roomid: room._id,
                        userid,
                        fromdate: fromdate,
                        todate: todate,
                        totalamount: totalAmount,
                        totaldays,
                        transactionid: uuidv4(),
                    })

                    const booking = await newBooking.save();

                    const roomTmp = await Hotel.findOne({ _id: room._id });
                    roomTmp.currentbookings.push({
                        bookingid: booking._id,
                    });

                    await roomTmp.save();
                    res.send("Payment Successful, Your Room is booked");

                } catch (error) {
                    next(error)
                }
            }

         } catch (error) {
            next(error)
        }   
    } catch (error) {
        next(error)
    }
}

export const getBookingByUserId = async(req, res, next) => {
    const {userid} = req.body

    try {
        const booking = await Booking.find({userid : userid});
        res.send(booking)
    } catch (error) {
        next(error)
    }
}

export const totalBooking= async(req, res, next) => {
    try {
      const bookingCount = await Booking.countDocuments();
      res.status(200).json(bookingCount)
    } catch (error) {
        next(error)
    }
}

export const cancelBooking = async(req, res, next) => {
    const {bookingid, roomid, dateslist} = req.body

    try {
        const getbooking = await Booking.findOne({_id: bookingid})
        getbooking.status = "cancelled"
        await getbooking.save()

        const getHotel = await Hotel.findOne({_id: roomid})
        const hotelBooking = getHotel.currentbookings

        const bookingDates = getHotel.rooms_unavailableDates
        getHotel.rooms_unavailableDates = bookingDates.filter((book) => !dateslist.includes(new Date(book).getTime()));
       
        const temp = hotelBooking.filter(booking => booking.bookingid.toString() !== bookingid)
        getHotel.currentbookings = temp

        await getHotel.save()
        res.send("Your booking cancelled successfully");

    } catch (error) {
        next(error)
    }
}