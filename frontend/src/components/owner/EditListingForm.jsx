import React, { useState } from "react";
import {
  Save,
  X,
  MapPin,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

const EditListingForm = ({ listing, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    ...listing,
    pricePerNight: listing.pricePerNight?.toString() ?? "",
    availableDates: listing.availableDates ?? [],
    images: [], // only new files
    existingImages: listing.images ?? [], // already in DB
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...files, ...prev.images],
    }));
  };

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedListing = {
      ...formData,
      pricePerNight: parseFloat(formData.pricePerNight),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedListing);
  };

  const isFormValid =
    formData.title?.trim() &&
    formData.location?.state?.trim() &&
    formData.location?.city?.trim() &&
    formData.location?.district?.trim() &&
    formData.location?.pincode?.trim() &&
    parseFloat(formData.pricePerNight) > 0;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center text-gray-800">
          <Save className="h-5 w-5 mr-2 text-red-500" />
          Edit Listing
        </h2>
        <button
          aria-label="Close"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <section>
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </section>

        <section>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </section>

        <section>
          <h3 className="text-lg font-medium flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-500" /> Location
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {["state", "district", "city", "pincode"].map((field) => (
              <div key={field}>
                <label className="capitalize">{field} *</label>
                <input
                  type="text"
                  name={`location.${field}`}
                  value={formData.location[field]}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-red-500" /> Pricing
          </h3>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleInputChange}
            min="0"
            required
            className="w-1/2 border rounded px-3 py-2 mt-2"
          />
        </section>

        {/* Images */}
        <section>
          <h3 className="text-lg font-medium flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-red-500" /> Images
          </h3>

          {/* Existing Images */}
          {formData.existingImages.length > 0 && (
            <div className="space-y-2 mt-3">
              {formData.existingImages.map((img, i) => (
                <div
                  key={`existing-${i}`}
                  className="flex justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span>{img.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Upload */}
          <div className="flex flex-col gap-2 mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="w-full border rounded px-3 py-2"
            />
            {formData.images.length > 0 && (
              <div className="space-y-2">
                {formData.images.map((img, i) => (
                  <div
                    key={`new-${i}`}
                    className="flex justify-between bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span>{img.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
           {saving ? 'Saving..' :" Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListingForm;