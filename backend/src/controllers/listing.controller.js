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

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const searchListings = async (req, res) => {
  try {
    const { location, checkin, checkout } = req.query;

    const query = {};

    // Flexible place search on city, district, or state
    if (location) {
      const locationRegex = new RegExp(location, "i");
      query.$or = [
        { "location.state": locationRegex },
        { "location.district": locationRegex },
        { "location.city": locationRegex }
      ];
    }

    // Date filters (only if both checkin and checkout are valid)
    const isValidCheckin = checkin && !isNaN(new Date(checkin));
    const isValidCheckout = checkout && !isNaN(new Date(checkout));

    if (isValidCheckin && isValidCheckout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      query.availableDates = {
        $elemMatch: {
          start: { $lte: checkinDate },
          end: { $gte: checkoutDate }
        }
      };
    }

    const listings = await Listing.find(query);
    console.log(listings);
    

    res.status(200).json({
      message: "Successfully fetched listings",
      count: listings.length,
      listings
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
