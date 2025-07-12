import React, { useState } from 'react';
import { Upload, X, MapPin, DollarSign, Calendar, Image as ImageIcon } from 'lucide-react';

export const AddListingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      state: '',
      district: '',
      city: '',
      pincode: '',
    },
    pricePerNight: '',
    images: [],
    availableDates: [{ start: '', end: '' }],
  });

  const [imageInput, setImageInput] = useState({ url: '', title: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [locationField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addImage = () => {
    if (imageInput.url && imageInput.title) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput],
      }));
      setImageInput({ url: '', title: '' });
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addAvailableDateRange = () => {
    setFormData((prev) => ({
      ...prev,
      availableDates: [...prev.availableDates, { start: '', end: '' }],
    }));
  };

  const updateAvailableDate = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      availableDates: prev.availableDates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pricePerNight: parseFloat(formData.pricePerNight),
      host: 'current-user-id',
      bookedSlots: [],
      availableDates: formData.availableDates.map((date) => ({
        start: new Date(date.start),
        end: new Date(date.end),
      })),
    });
    setFormData({
      title: '',
      description: '',
      location: { state: '', district: '', city: '', pincode: '' },
      pricePerNight: '',
      images: [],
      availableDates: [{ start: '', end: '' }],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Upload className="mr-3 h-6 w-6 text-red-500" />
          Add New Listing
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Beautiful beachfront villa..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Describe your property..."
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-red-500" />
            Location
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {['state', 'district', 'city', 'pincode'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)} *
                </label>
                <input
                  type="text"
                  name={`location.${field}`}
                  value={formData.location[field]}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={field === 'pincode' ? '123456' : ''}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-red-500" />
            Pricing
          </h3>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Night (₹) *
            </label>
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="2500"
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ImageIcon className="mr-2 h-5 w-5 text-red-500" />
            Images
          </h3>

          <div className="flex gap-4">
            <input
              type="url"
              value={imageInput.url}
              onChange={(e) =>
                setImageInput((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="Image URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <input
              type="text"
              value={imageInput.title}
              onChange={(e) =>
                setImageInput((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Image title"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Add
            </button>
          </div>

          {formData.images.length > 0 && (
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-sm font-medium">{image.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-red-500" />
            Available Dates
          </h3>

          {formData.availableDates.map((dateRange, index) => (
            <div key={index} className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    updateAvailableDate(index, 'start', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    updateAvailableDate(index, 'end', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAvailableDateRange}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            + Add another date range
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
};
