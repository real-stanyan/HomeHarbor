import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser, getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);

router.get("/get-user/:id", getUser);

export default router;
