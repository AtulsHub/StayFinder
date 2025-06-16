import React from 'react';
import { Link } from 'react-router-dom';

const properties = [
  {
    id: 1,
    title: 'Cozy Apartment in City Center',
    location: 'New York',
    price: 120,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Modern Loft with View',
    location: 'San Francisco',
    price: 200,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'Beachside Bungalow',
    location: 'Miami',
    price: 150,
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
  },
];

const PropertyList = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {properties.map((property) => (
      <div key={property.id} className="bg-white rounded-lg shadow p-4">
        <img src={property.image} alt={property.title} className="w-full h-40 object-cover rounded mb-2" />
        <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
        <p className="text-gray-600 mb-1">{property.location}</p>
        <p className="text-blue-600 font-bold mb-2">${property.price} / night</p>
        <Link to={`/listing/${property.id}`} className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">View Details</Link>
      </div>
    ))}
  </div>
);

export default PropertyList;
