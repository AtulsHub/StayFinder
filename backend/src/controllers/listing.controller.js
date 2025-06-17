import { Listing } from "../modals/listing.modal.js";

const getAllItems = async (req, res) => {
  try {
    const listing = await Listing.find();
    console.log(listing);
    res.status(200).json({
      message: "successfully fetched all the listing",
      listing,
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
    const {
      location,
      checkin,
      checkout,
      page = 1,
      perPage = 10,
    } = req.query;

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




export { 
    getAllItems, 
    getById,
    searchListings
 };
