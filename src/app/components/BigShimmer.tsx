import React from 'react';
import largePoster from "../assets/posterLogoLarge.png";

const BigShimmer: React.FC = () => {
  return (
    <div className="relative bg-gray-800 rounded-lg shadow-lg w-full h-96 animate-pulse">
      <div className="w-full h-full bg-gray-700">
      <img
                 src={`${largePoster.src}`}
                className="w-full h-full object-cover"
              />
      </div>
    </div>
  );
};

export default BigShimmer;
