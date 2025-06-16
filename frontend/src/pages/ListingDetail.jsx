import React from 'react';
import PropertyDetail from '../components/PropertyDetail';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ListingDetail = () => {
  const { id } = useParams();
  return (
    <div>
      <PropertyDetail />
    </div>
  );
};

export default ListingDetail;
