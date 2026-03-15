import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    deliveryAdress: { type: String, required: true, minlength: 5 },
    role: { type: String, enum: ["admin", "user"], default: "user" }
});

const User = mongoose.model("User", userSchema);

export default User;