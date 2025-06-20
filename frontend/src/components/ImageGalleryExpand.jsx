import React, { useState } from "react";

const ImageGalleryExpand = ({ images, setShowImage }) => {
  const [showGallery, setShowGallery] = useState(true);
  console.log(images);

  if (!images.length) return null;

  return (
     <div className={`fixed mb-6 z-60 w-full h-full bg-[rgba(33,33,33,0.97)] overflow-x-auto scrollbar-hidden px-8 py-8 text-white text-center`}>
      <button className="fixed text-md top-8 right-8 p-2 px-3 rounded-lg bg-[#cd3737] text-white shadow-lg hover:bg-red-700 hover:scale-105 transition duration-100 z-10"
      onClick={() => setShowImage(false)}>
      X
    </button>
      <h2 className="text-4xl font-semibold mb-8">Image Gallery</h2>

      {/* Grid Preview or Full */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3" >
        {images.map((img, idx) => (
          <div key={idx} className="rounded overflow-hidden shadow">
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 text-md font-medium  text-white text-center">{img.title}</div>
          </div>
        ))}
      </div>

      {/* Toggle Button */}
    </div>
 
    );
};

export default ImageGalleryExpand;
