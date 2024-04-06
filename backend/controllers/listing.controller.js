import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

// create listing
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    console.log("🚀 ~ createListing ~ listing:", listing);

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// get listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// get listings
export const getListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().sort("-1").limit(10);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// update listing
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found!"));

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }
};

// delete listing
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(404, "Listing not found!"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only delete your own listings!"));

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};
