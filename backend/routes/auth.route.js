import express from "express";

// import Controllers
import {
  signup,
  signin,
  signout,
  google,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.get("/sign-out", signout);
router.post("/google", google);

export default router;
