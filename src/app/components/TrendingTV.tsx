"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchtrendingTVs, fetchTvDetails } from '../api/tmdb';
import { TVShow, TVShowDetails } from '../types/types';
import SmallShimmer from './SmallShimmer';
import smallPoster from "../assets/posterLogoSmall.png";

const TrendingTV: React.FC = () => {
  const [trendingTVs, setTrendingTVs] = useState<TVShow[]>([]);
  const [tvDetailsMap, setTvDetailsMap] = useState<Map<number, TVShowDetails>>(new Map());
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getTrendingTVs = async () => {
      try {
        const tvShows = await fetchtrendingTVs();
        setTrendingTVs(tvShows);

        const detailsPromises = tvShows.map((tv: { id: number; }) => fetchTvDetails(tv.id));
        const detailsArray = await Promise.all(detailsPromises);

        const detailsMap = new Map<number, TVShowDetails>();
        detailsArray.forEach(details => {
          if (details) {
            detailsMap.set(details.id, details);
          }
        });
        setTvDetailsMap(detailsMap);
      } catch (error) {
        console.error('Error fetching trending TV shows or details:', error);
      }
    };

    getTrendingTVs();
  }, []);

  const imageUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || '';

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleTVClick = (tvId: number) => {
    router.push(`/details?type=tv&id=${tvId}`);
  };

  return (
    <div className="relative w-full h-auto py-8 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <h1 className="text-3xl font-semibold mb-6 pl-5 text-left">Trending TV Shows</h1>
      <div 
        ref={scrollContainerRef} 
        className="w-full flex overflow-x-auto space-x-4 px-4 py-2 no-scrollbar"
        onScroll={handleScroll}
      >
        {trendingTVs.length > 0 ? (
          trendingTVs.map(tv => {
            const details = tvDetailsMap.get(tv.id);
            const releaseYear = tv.first_air_date?.split('-')[0] || '';
            const language = details?.original_language?.toUpperCase() || '';

            return (
              <div
                key={tv.id}
                onClick={() => handleTVClick(tv.id)}
                className="relative flex-none w-40 h-60 bg-gray-800 rounded-lg overflow-hidden shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                <img
                    src={tv.poster_path ? `${imageUrl}${tv.poster_path}` : `${smallPoster.src}`}
                  alt={tv.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-90 transition-opacity duration-300 p-4">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-1">{tv.name}</h2>
                    <div className="flex items-center justify-center mb-1">
                      <i className="fas fa-star text-yellow-400 mr-1"></i>
                      <p className="text-sm text-gray-300">{tv.vote_average.toFixed(1)} / 10</p>
                    </div>
                    <p className="text-xs text-gray-400">{releaseYear}</p>
                    <p className="text-sm text-gray-300 mt-2">{language}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
         // Show shimmer loaders while top-rated movies are being fetched
         Array(8).fill(0).map((_, index) => <SmallShimmer key={index} />)
        )}
      </div>
      {scrollPosition > 0 && (
        <button 
          onClick={scrollLeft} 
          className="hidden sm:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-mixed-100 text-green rounded-full p-3 hover:bg-gray-700 transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      )}
      <button 
        onClick={scrollRight} 
        className="hidden sm:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-mixed-100 text-green rounded-full p-3 hover:bg-gray-700 transition-colors"
      >
        <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default TrendingTV;
