"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchTvseasons } from '../api/tmdb';
import { SeasonDetails, Episode } from '../types/types';
import smallPoster from "../assets/posterLogoSmall.png";
import largePoster from "../assets/posterLogoLarge.png";

const Seasons = () => {
  const [showFullOverview, setShowFullOverview] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [tvId, setTvId] = useState<string | null>(null);
  const [seasonNumber, setSeasonNumber] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setTvId(searchParams.get('tvId'));
    setSeasonNumber(searchParams.get('seasonNumber'));
  }, []);

  useEffect(() => {
    const fetchSeasonData = async () => {
      if (tvId && seasonNumber) {
        const data = await fetchTvseasons(tvId, seasonNumber);
        if (data) {
          setSeasonDetails(data);
        }
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [tvId, seasonNumber]);

  const handleEpisodeClick = (episodeNumber: number) => {
    if (tvId && seasonNumber) {
      router.push(`/watch?type=tv&id=${tvId}&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}`);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (!seasonDetails) {
    return <div className="text-center text-white">Season details not found</div>;
  }

  const openOverviewModal = () => {
    setIsModalOpen(true);
  };

  const closeOverviewModal = () => {
    setIsModalOpen(false);
  };

  const imageUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL;
  const backgroundImage = seasonDetails.poster_path
    ? `${imageUrl}${seasonDetails.poster_path}`
    : `${largePoster.src}`;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      <div className="relative z-10 max-w-screen-xl mx-auto py-16 px-8 lg:px-16">
        <h1 className="text-white text-6xl lg:text-8xl mt-16 font-bold mb-8 drop-shadow-lg">{seasonDetails.name}</h1>

        <div className="relative text-white text-lg mb-8 max-w-4xl drop-shadow-lg">
          <p className={`transition-all duration-300 ${showFullOverview ? 'line-clamp-none' : 'line-clamp-5'}`}>
            {seasonDetails.overview || 'No description available.'}
          </p>
          {!showFullOverview && seasonDetails.overview.length > 300 && (
            <button
              onClick={openOverviewModal}
              className="text-blue-400 underline mt-2"
            >
              Read More
            </button>
          )}
        </div>

        <h2 className="text-white text-4xl lg:text-5xl font-bold mb-8 drop-shadow-lg">Episodes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {seasonDetails.episodes.map((episode: Episode) => (
            <div 
              key={episode.id} 
              className="relative bg-gray-800 bg-opacity-80 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex flex-col"
              onClick={() => handleEpisodeClick(episode.episode_number)}
            >
              <div className="relative w-full h-64">                
                  <img 
                  src={episode.still_path ? `${imageUrl}${episode.still_path}` : `${smallPoster.src}`}
                    alt={episode.name} 
                    className="w-full h-full object-cover"
                  />
               
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100">
                  <i className="fas fa-play-circle text-white text-heading1"></i>
                </div>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Episode {episode.episode_number}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {episode.overview || 'No description available.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg">
            <button
              onClick={closeOverviewModal}
              className="absolute top-0 right-0 mt-4 mr-4 text-white text-3xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-white text-2xl font-bold mb-4">{seasonDetails.name || 'Details'}</h2>
            <p className="text-gray-300 text-lg">{seasonDetails.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seasons;
