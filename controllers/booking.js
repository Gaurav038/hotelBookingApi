import moment from "moment"
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid'
import Booking from '../models/Booking.js'
import Hotel from "../models/Hotel.js";

const stripe = new Stripe('sk_test_51JkQ5ESHQQudBiguqRq7JkJ8oamRAnL4NnSRETesVbZWZEXxh0Rja7czBbaYdbNA30YiR74guZMonHiQqHoGuISQ00FNUebZtw');

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
                        fromdate: moment(fromdate).format("DD-MM-YYYY"),
                        todate: moment(todate).format("DD-MM-YYYY"),
                        totalamount: totalAmount,
                        totaldays,
                        transactionid: uuidv4(),
                    })

                    const booking = await newBooking.save();

                    const roomTmp = await Hotel.findOne({ _id: room._id });
                    roomTmp.currentbookings.push({
                        bookingid: booking._id,
                        fromdate: moment(fromdate).format("DD-MM-YYYY"),
                        todate: moment(todate).format("DD-MM-YYYY"),
                        userid: userid,
                        status: booking.status,
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