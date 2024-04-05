import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    imageUrls: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["apartment", "house"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["rent", "sell"],
      required: true,
    },
    bedroom: {
      type: String,
      required: true,
    },
    bathroom: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discount_price: {
      type: String,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
