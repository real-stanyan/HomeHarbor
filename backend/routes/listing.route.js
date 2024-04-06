import express from "express";

// import controllers
import {
  createListing,
  getListing,
  getListings,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";

// import Utils
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// create listing
router.post("/post-listing", verifyToken, createListing);
// get listing
router.get("/get-listing/:id", verifyToken, getListing);
// get listings
router.get("/get-listings", getListings);
// update listing
router.post("/update-listing/:id", verifyToken, updateListing);
// delete listing
router.delete("/delete-listing/:id", verifyToken, deleteListing);

export default router;
