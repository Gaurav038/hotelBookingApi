import Users from "../models/Users.js";
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        const newUser = new Users({
            ...req.body,
            password: hash
        })

        await newUser.save()
        res.status(200).send("User has been created")

    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {

        const user = await Users.findOne({username: req.body.username})
        if(!user) return next(createError(404, "user not found!!"))

        const passMatch = await bcrypt.compare(req.body.password, user.password)
        if(!passMatch) return next(createError(404, "password not match!!"))

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET_KEY)

        const {password, isAdmin, ...otherDetails} = user._doc
        console.log(token);
        res.cookie('jwttoken', token,
            {
                secure: process.env.NODE_ENV === 'localhost' ? 'auto' : true,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                sameSite: process.env.NODE_ENV === 'localhost' ? 'lax' : 'none',
            
            }
            )
           .status(200).send({details: {...otherDetails, isAdmin}, isAdmin})

    } catch (error) {
        next(error)
    }
}