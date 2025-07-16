import { Listing } from "../modals/listing.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllItems = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;

    // Convert page and perPage to integers
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    const query = {};
    const total = await Listing.countDocuments(query);
    console.log(total);

    // Apply pagination
    const listings = await Listing.find(query).skip(skip).limit(limit);
    console.log(listings);
    res.status(200).json({
      message: "successfully fetched all the listing",
      total,
      totalPages: Math.ceil(total / limit),
      listings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(500).json({ message: "provide the item id" });
    }

    const item = await Listing.findById(id);
    if (!item) {
      res.status(500).json({ message: "No item with this id found" });
    }

    res.status(200).json({
      message: "successfully fetched the item",
      item,
    });

    console.log(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchListings = async (req, res) => {
  try {
    const { location, checkin, checkout, page = 1, perPage = 10 } = req.query;

    // Log incoming query for debugging
    console.log("Received query:", req.query);

    const query = {};

    // Flexible place search on city, district, or state
    if (location) {
      const locationRegex = new RegExp(location, "i");
      query.$or = [
        { "location.state": locationRegex },
        { "location.district": locationRegex },
        { "location.city": locationRegex },
      ];
    }

    // Safe date filter only when both dates are valid and not empty
    const isValidCheckin = checkin && !isNaN(Date.parse(checkin));
    const isValidCheckout = checkout && !isNaN(Date.parse(checkout));

    if (isValidCheckin && isValidCheckout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      query.availableDates = {
        $elemMatch: {
          start: { $lte: checkinDate },
          end: { $gte: checkoutDate },
        },
      };
    }

    // Convert page and perPage to integers
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    // Count total documents before pagination
    const total = await Listing.countDocuments(query);

    // Apply pagination
    const listings = await Listing.find(query).skip(skip).limit(limit);

    res.status(200).json({
      message: "Successfully fetched listings",
      page: parseInt(page),
      perPage: limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Error in searchListings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      host,
      availableDates,
    } = req.body;

    if (!title || !location || !pricePerNight || !host) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Parse nested fields (sent as JSON strings in form-data)
    const parsedLocation = JSON.parse(location);
    const parsedDates = availableDates ? JSON.parse(availableDates) : [];

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (result) {
          images.push({
            url: result.secure_url,
            title: file.originalname,
          });
        }
      }
    }

    const listing = await Listing.create({
      title,
      description,
      location: parsedLocation,
      pricePerNight,
      availableDates: parsedDates,
      images,
      host,
    });

    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateListing = async (req, res) => {
  const { id } = req.params;

  try {
    let updates = { ...req.body };

    if (updates.location) {
      updates.location = JSON.parse(updates.location);
    }

    if (updates.availableDates) {
      updates.availableDates = JSON.parse(updates.availableDates);
    }

    if (req.files && req.files.length > 0) {
      const images = [];
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (result) {
          images.push({
            url: result.secure_url,
            title: file.originalname,
          });
        }
      }
      updates.images = images; // Replace images
    }

    const updated = await Listing.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteListing = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/listing/user/:userId
const getListingsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const listings = await Listing.find({ host: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err) {
    console.error("Error fetching listings by userId:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings for user",
    });
  }
};

export {
  getAllItems,
  getById,
  searchListings,
  createListing,
  deleteListing,
  updateListing,
  getListingsByUserId,
};
