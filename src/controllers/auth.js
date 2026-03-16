import User from "../models/User.js"
import bcrypt from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";

const registerSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required(),
    deliveryAdress: Joi.string().min(6).required()
})

const googleSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    googleId: Joi.string().required()
})

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required(),
})

const generateToken = (data) => {
    return jwt.sign({ id: data }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const register = async (req, res) => {
    try {
        const { name, email, password, deliveryAdress } = req.body

        const validation = registerSchema.validate(req.body)

        if (validation.error) {
            return res.status(400).json(validation.error.details[0].message)
        }

        const uniqueEmail = await User.findOne({ email: email })

        if (uniqueEmail) {
            return res.status(400).json({ error: "Email already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await new User({
            name: name,
            email: email,
            password: hashPassword,
            deliveryAdress: deliveryAdress
        });

        user.save();

        const token = generateToken(existingEmail.id)

        res.status(201).json(token);

    } catch (err) {
        res.status(400).json({ error: "Bad request", message: err })
    }
}

const googleAuth = async (req, res) => {
    try {
        const { given_name, email, id } = req.user

        const validation = googleSchema.validate({
            name: given_name,
            email: email,
            googleId: id
        })

        if (validation.error) {
            return res.status(400).json(validation.error.details[0].message)
        }

        const uniqueGoogleId = await User.findOne({ googleId: id })

        if (uniqueGoogleId) {
            const token = generateToken(id)
            return res.json(token)
        }

        const user = await new User({
            name: given_name,
            email: email,
            googleId: id
        });

        const created = user.save();

        const token = generateToken(id)

        res.status(201).json(token);

    } catch (err) {
        res.status(400).json({ error: "Bad request", message: err })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const validation = loginSchema.validate(req.body)

        if (validation.error) {
            return res.status(400).json(validation.error.details[0].message)
        }

        const existingEmail = await User.findOne({ email: email })

        if (!existingEmail) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const hashPassword = existingEmail.password

        const user = await bcrypt.compare(password, hashPassword)

        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const token = generateToken(existingEmail.id)

        res.status(200).json(token)

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: "Bad request" })
    }
}

export { register, login, googleAuth }