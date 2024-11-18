import express from "express";
import { signup } from "../controllers/UserController.js";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);

export default userRoutes;
