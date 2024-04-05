import express from "express";

// import controllers
import {
  createListing,
  getListing,
  deleteListing,
} from "../controllers/listing.controller.js";

// import Utils
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// create listing
router.post("/post-listing", verifyToken, createListing);
// get listing
router.get("/get-listing/:id", verifyToken, getListing);
// delete listing
router.delete("/delete-listing/:id", verifyToken, deleteListing);

export default router;
