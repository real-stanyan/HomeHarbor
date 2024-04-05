import express from "express";

// import controllers
import {
  createListing,
  getListing,
} from "../controllers/listing.controller.js";

// import Utils
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// create listing
router.post("/post-listing", verifyToken, createListing);
// get listing
router.get("/get-listing/:id", verifyToken, getListing);

export default router;
