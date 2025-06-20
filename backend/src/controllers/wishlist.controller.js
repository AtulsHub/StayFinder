import { Wishlist } from "../modals/wishlist.modal.js";

// Add a listing to user's wishlist
export const addToWishlist = async (req, res) => {
  const { userId } = req.body;
  const { listingId } = req.params;
  console.log("userId", userId, "listingId", listingId);
  

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, listings: [listingId] });
    } else if (!wishlist.listings.includes(listingId)) {
      wishlist.listings.push(listingId);
    }

    await wishlist.save();
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Remove a specific listing from wishlist
export const removeFromWishlist = async (req, res) => {
  const { userId } = req.body;
  const { listingId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.listings = wishlist.listings.filter(
      (id) => id.toString() !== listingId
    );

    await wishlist.save();
    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

// Remove all listings from wishlist
export const clearWishlist = async (req, res) => {
  const { userId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.listings = [];
    await wishlist.save();

    res.status(200).json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error clearing wishlist", error });
  }
};

export const getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate("listings");

    if (!wishlist) {
      return res.status(200).json({ listings: [] });
    }

    res.status(200).json({ listings: wishlist.listings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};

