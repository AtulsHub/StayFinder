import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // General Settings
    siteName: {
      type: String,
      default: "StayFinder",
    },
    siteDescription: {
      type: String,
      default: "Find your perfect stay",
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR"],
    },

    // Business Settings
    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 50,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    // Notification Settings
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
    bookingConfirmation: {
      type: Boolean,
      default: true,
    },
    paymentReminders: {
      type: Boolean,
      default: true,
    },

    // User Management Settings
    allowGuestReviews: {
      type: Boolean,
      default: true,
    },
    autoApproveListings: {
      type: Boolean,
      default: false,
    },
    requireIdVerification: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model("Settings", settingsSchema);
