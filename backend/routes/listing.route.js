import express from "express";

// import controllers
import { createListing } from "../controllers/listing.controller.js";

// import Utils
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/post-listing", verifyToken, createListing);

export default router;
