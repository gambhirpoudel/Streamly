import React from 'react';
import smallPoster from "../assets/posterLogoSmall.png";

const SmallShimmer: React.FC = () => {
  return (
    <div className="relative flex-none w-40 h-60 bg-gray-800 rounded-lg overflow-hidden shadow-xl animate-pulse">
      <div className="w-full h-full bg-gray-700">
      <img
                 src={`${smallPoster.src}`}
                className="w-full h-full object-cover"
              />
      </div>
    </div>
  );
};

export default SmallShimmer;