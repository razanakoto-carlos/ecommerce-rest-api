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
    return jwt.sign({ _id: data }, process.env.JWT_SECRET, { expiresIn: "7d" });
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

        const user = new User({
            name: name,
            email: email,
            password: hashPassword,
            deliveryAdress: deliveryAdress
        });

        const userRegister = await user.save();

        const token = generateToken(userRegister.id)

        res.status(201).json({ token });

    } catch (err) {
        console.log(err)
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

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

        if (uniqueGoogleId) {
            const token = generateToken(uniqueGoogleId.id)
            return res.redirect(`${frontendUrl}/auth/callback?token=${token}`)
        }

        const user = new User({
            name: given_name,
            email: email,
            googleId: id
        });

        const created = await user.save();

        const token = generateToken(created.id)

        res.redirect(`${frontendUrl}/auth/callback?token=${token}`)

    } catch (err) {
        console.log(err)
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
        res.redirect(`${frontendUrl}/login?error=google_auth_failed`)
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
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

        res.status(200).json({ token })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: "Bad request" , message:err})
    }
}

export { register, login, googleAuth, getMe }