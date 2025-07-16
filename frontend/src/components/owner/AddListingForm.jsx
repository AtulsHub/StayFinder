import React, { useState } from "react";
import {
  Upload,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  X,
} from "lucide-react";
import listingService from "../../backendConnect/listing";
import { useSelector } from "react-redux";
import NotificationPopup from "../utils/NotificationBar";

const AddListingForm = () => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const selector = useSelector((state) => state.user.userData._id);

  const showPopup = (message, type) => {
    setNotification({ message: message, type: "info" });
    // auto-close after 3s
  };
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: {
      state: "",
      district: "",
      city: "",
      pincode: "",
    },
    pricePerNight: "",
  });

  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [locField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("pricePerNight", formData.pricePerNight);
      formDataToSend.append("host", selector); // replace as needed

      formDataToSend.append("location", JSON.stringify(formData.location));

      images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await listingService.addListing(formDataToSend);

      // console.log("Listing created:", response);
      showPopup("Listing created", "info");

      // Reset
      setFormData({
        title: "",
        description: "",
        location: { state: "", district: "", city: "", pincode: "" },
        pricePerNight: "",
        availableDates: [{ start: "", end: "" }],
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      showPopup(err.message, "info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto p-4 md:p-8">
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mb-6 border-b pb-4 flex items-center space-x-2">
        <Upload className="text-red-500 h-6 w-6" />
        <h2 className="text-xl font-semibold text-gray-800">Add New Listing</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="Beautiful Homestay..."
          />

          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="Describe your property..."
          />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="text-red-500 h-5 w-5" />
            <h3 className="text-lg font-medium">Location *</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["state", "district", "city", "pincode"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={`location.${field}`}
                  value={formData.location[field]}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-red-500 h-5 w-5" />
            <h3 className="text-lg font-medium">Pricing *</h3>
          </div>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleInputChange}
            required
            min={0}
            step={0.01}
            className="w-full md:w-1/2 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="1500"
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ImageIcon className="text-red-500 h-5 w-5" />
            <h3 className="text-lg font-medium">Images *</h3>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />

          {images.length > 0 && (
            <ul className="space-y-1 text-sm">
              {images.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListingForm;
