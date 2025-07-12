import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import wishlistService from "../../backendConnect/wishlist";
import { useSelector } from "react-redux";
import NotificationPopup from "./NotificationBar";

const WishlistIcon = ({ hotel }) => {
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);
  const userId = useSelector((state) => state.user?.userData?._id);

  useEffect(() => {
    if (userId) fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist(userId);
      setWishlist(data.listings || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err.message);
    }
  };

  const toggleWishlist = async () => {
    if (!userId) {
      setNotification({ message: "Please login to add to wishlist.", type: "info" });
      return;
    }

    try {
      const isWishlisted = wishlist.some((item) => item._id === hotel._id);

      if (isWishlisted) {
        await wishlistService.removeFromWishlist(userId, hotel._id);
        setWishlist((prev) => prev.filter((item) => item._id !== hotel._id));
      } else {
        await wishlistService.addToWishlist(userId, hotel._id);
        setWishlist((prev) => [...prev, hotel]);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err.message);
    }
  };

  const isWishlisted = wishlist.some((item) => item._id === hotel._id);

  return (
    <>
      <FaHeart
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 text-xl drop-shadow cursor-pointer transition hover:scale-110 ${
          isWishlisted ? "text-red-500" : "text-gray-100"
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      />
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default WishlistIcon;
