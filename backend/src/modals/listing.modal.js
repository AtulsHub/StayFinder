import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  location: {
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      match: /^[1-9][0-9]{5}$/, // Indian pincode pattern
    },
  },

  pricePerNight: {
    type: Number,
    required: true,
  },

  images: [{
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  }],

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  availableDates: [{
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  }],

  bookedSlots: [{
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
  }],

}, { timestamps: true });

export const Listing = mongoose.model("Listing", listingSchema);
