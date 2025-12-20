import express from "express";
import { login, register, googleAuth, getUserHistory, addToHistory } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/auth/google", googleAuth);
router.get("/get_all_activity", getUserHistory);
router.post("/add_to_activity", addToHistory);

export default router;
