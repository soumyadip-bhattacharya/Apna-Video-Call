import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// --- 1. STANDARD LOGIN ---
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide Username and Password" });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
        }

        if (user.fromGoogle && !user.password) {
            return res.status(400).json({ message: "This account uses Google Sign-In. Please use that instead." });
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token, user: user });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or Password" });
        }
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong: ${e}` });
    }
}

// --- 2. STANDARD REGISTER ---
const register = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword,
            email: username + "@placeholder.com",
            fromGoogle: false
        });
        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "User Registered" });
    } catch (e) {
        res.status(500).json({ message: `Something went wrong: ${e}` });
    }
}

// --- 3. GOOGLE AUTH ---
const googleAuth = async (req, res) => {
    try {
        const { name, email, username } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            const token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(200).json({ message: "Login successful", token, user });
        } else {
            const newUser = new User({
                name,
                email,
                username,
                fromGoogle: true
            });
            const token = crypto.randomBytes(20).toString("hex");
            newUser.token = token;
            await newUser.save();
            return res.status(201).json({ message: "User registered with Google", token, user: newUser });
        }
    } catch (error) {
        console.error("Backend Google Auth Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// --- 4. HISTORY ---
const getUserHistory = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        const history = await User.find({ token: token }).select("meetingHistory");
        res.json(history[0].meetingHistory);
    } catch (e) {
        res.json({ message: `Error in getting history: ${e}` });
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }
        const newMeeting = { meetingCode: meeting_code, date: Date.now() };
        user.meetingHistory.push(newMeeting);
        await user.save();
        res.status(httpStatus.CREATED).json({ message: "Added to history" });
    } catch (e) {
        res.json({ message: `Error in adding to history: ${e}` });
    }
}

export { login, register, googleAuth, getUserHistory, addToHistory };