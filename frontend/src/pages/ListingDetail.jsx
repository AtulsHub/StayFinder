import React from 'react';
import PropertyDetail from '../components/PropertyDetail';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ListingDetail = () => {
  const { id } = useParams();
  return (
    <div>
      <PropertyDetail />
      <Footer />
    </div>
  );
};

export default ListingDetail;
