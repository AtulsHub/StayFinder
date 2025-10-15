import { Settings } from "../modals/settings.modal.js";

// Get settings (or create default if not exists)
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.status(200).json({
      message: "Settings fetched successfully",
      settings,
    });
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      siteDescription,
      currency,
      commissionRate,
      maintenanceMode,
      emailNotifications,
      smsNotifications,
      bookingConfirmation,
      paymentReminders,
      allowGuestReviews,
      autoApproveListings,
      requireIdVerification,
    } = req.body;

    let settings = await Settings.findOne();

    // If no settings exist, create new
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      // Update existing settings
      if (siteName !== undefined) settings.siteName = siteName;
      if (siteDescription !== undefined) settings.siteDescription = siteDescription;
      if (currency !== undefined) settings.currency = currency;
      if (commissionRate !== undefined) settings.commissionRate = commissionRate;
      if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
      if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
      if (smsNotifications !== undefined) settings.smsNotifications = smsNotifications;
      if (bookingConfirmation !== undefined) settings.bookingConfirmation = bookingConfirmation;
      if (paymentReminders !== undefined) settings.paymentReminders = paymentReminders;
      if (allowGuestReviews !== undefined) settings.allowGuestReviews = allowGuestReviews;
      if (autoApproveListings !== undefined) settings.autoApproveListings = autoApproveListings;
      if (requireIdVerification !== undefined) settings.requireIdVerification = requireIdVerification;

      await settings.save();
    }

    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset settings to default
export const resetSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    } else {
      // Reset to defaults
      settings.siteName = "StayFinder";
      settings.siteDescription = "Find your perfect stay";
      settings.currency = "INR";
      settings.commissionRate = 10;
      settings.maintenanceMode = false;
      settings.emailNotifications = true;
      settings.smsNotifications = false;
      settings.bookingConfirmation = true;
      settings.paymentReminders = true;
      settings.allowGuestReviews = true;
      settings.autoApproveListings = false;
      settings.requireIdVerification = true;

      await settings.save();
    }

    res.status(200).json({
      message: "Settings reset to default successfully",
      settings,
    });
  } catch (err) {
    console.error("Reset settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
