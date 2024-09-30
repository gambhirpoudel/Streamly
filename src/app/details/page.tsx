"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchMovieDetails,
  fetchmovieCredits,
  fetchTvcredits,
  fetchMovieVideos,
  fetchTvVideos,
  fetchTvDetails,
} from '../api/tmdb';
import { MovieDetails, TVShowDetails, Video } from '../types/types';
import largePoster from "../assets/posterLogoLarge.png";
import smallPoster from "../assets/posterLogoSmall.png";

const DetailsPage: React.FC = () => {
  const [details, setDetails] = useState<MovieDetails | TVShowDetails | null>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState<boolean>(false);
  const [showFullOverview, setShowFullOverview] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
  const [showRightButton, setShowRightButton] = useState<boolean>(true);
  const [showSeasonLeftButton, setShowSeasonLeftButton] = useState<boolean>(false);
  const [showSeasonRightButton, setShowSeasonRightButton] = useState<boolean>(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollSeasonContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [type, setType] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setType(searchParams.get('type'));
    setId(searchParams.get('id'));
  }, []);

  useEffect(() => {
    const fetchDetailsAndCast = async () => {
      try {
        if (!type || !id) return;

        let detailsData;
        let creditsData;
        let videosData;

        if (type === 'movie') {
          detailsData = await fetchMovieDetails(Number(id));
          creditsData = await fetchmovieCredits(Number(id));
          videosData = await fetchMovieVideos(Number(id));
        } else if (type === 'tv') {
          detailsData = await fetchTvDetails(Number(id));
          creditsData = await fetchTvcredits(Number(id));
          videosData = await fetchTvVideos(Number(id));
        }

        setDetails(detailsData || null);
        setCast(creditsData?.cast || []);

        const trailer = videosData?.find(
          (video: Video) =>
            video.name === 'Official Trailer' ||
            (video.type === 'Trailer' && video.site === 'YouTube')
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (error) {
        console.error('Error fetching details or cast:', error);
      }
    };

    fetchDetailsAndCast();
  }, [type, id]);

  const imageUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || '';

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollSeasonRight = () => {
    if (scrollSeasonContainerRef.current) {
      scrollSeasonContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollSeasonLeft = () => {
    if (scrollSeasonContainerRef.current) {
      scrollSeasonContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleSeasonScroll = () => {
    if (scrollSeasonContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollSeasonContainerRef.current;
      setShowSeasonLeftButton(scrollLeft > 0);
      setShowSeasonRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleWatchNow = () => {
    if (trailerKey) {
      setIsTrailerPlaying(true);
    }
  };

  const handlePlayNow = () => {
    router.push(`/watch?type=${type}&id=${id}`);
  };

  const openOverviewModal = () => {
    setIsModalOpen(true);
  };

  const closeOverviewModal = () => {
    setIsModalOpen(false);
  };

  if (!details) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
<div className="relative w-full bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `url(${imageUrl}${details.backdrop_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'brightness(30%)', 
    }}
  />

      {/* Main Content */}
      <div className="relative max-w-screen-xl mx-auto px-4 mt-20 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <img
            src={details.poster_path ? `${imageUrl}${details.poster_path}` : `${largePoster.src}`}
            alt={('title' in details ? details.title : details.name) || 'Details'}
            className="w-48 sm:w-64 md:w-80 h-auto md:h-96 object-cover rounded-lg shadow-2xl border border-gray-800"
          />
          <div className="md:ml-8 mt-6 md:mt-0 flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">
              {('title' in details ? details.title : details.name) || 'Details'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <i className="fas fa-star text-yellow-400 text-xl"></i>
                <p className="text-lg">{details.vote_average.toFixed(1) || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-calendar-alt text-lg"></i>
                <p className="text-lg">
                  {('release_date' in details ? details.release_date : details.first_air_date) || 'N/A'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-language text-lg"></i>
                <p className="text-lg">{details.original_language.toUpperCase() || 'N/A'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-2 justify-center md:justify-start">
              {('genres' in details ? details.genres : []).map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="overview-container text-gray-300 text-sm sm:text-base mb-4" style={{ maxWidth: '800px' }}>
              <p className={`${showFullOverview ? 'line-clamp-none' : 'line-clamp-3'}`}>
                {details.overview}
              </p>
              {!showFullOverview && details.overview.length > 300 && (
                <button
                  onClick={openOverviewModal}
                  className="text-blue-400 underline mt-2"
                >
                  Read More
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                onClick={handleWatchNow}
                className="bg-white text-black px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center w-full sm:w-auto"
              >
                <i className="fas fa-play mr-2"></i>
                Play Trailer
              </button>
              {type !== 'tv' && (
                <button
                  onClick={handlePlayNow}
                  className="bg-opacity-15 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg bg-white hover:bg-opacity-30 transition-colors duration-300 flex items-center justify-center w-full sm:w-auto border border-white"
                >
                  <i className="fas fa-circle-play mr-2"></i>
                  Play Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seasons Section */}
      {type === 'tv' && details && details.seasons.length > 0 && (
        <div className="py-6 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Seasons</h2>
          <div className="relative">
            <div
              className="w-full flex overflow-x-auto space-x-4 py-2 snap-x no-scrollbar"
              ref={scrollSeasonContainerRef}
              onScroll={handleSeasonScroll}
            >
              {details.seasons
                .filter((season) => season.name.toLowerCase() !== 'specials')
                .map((season) => (
                  <div
                    key={season.season_number}
                    className="relative flex-none w-32 sm:w-40 h-48 sm:h-60 bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer snap-start"
                    onClick={() =>
                      router.push(`/seasons?tvId=${details.id}&seasonNumber=${season.season_number}`)
                    }
                  >
                    <img
                      src={season.poster_path ? `${imageUrl}${season.poster_path}` : `${smallPoster.src}`}
                      alt={season.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 bg-gradient-to-t from-black via-black opacity-80 w-full text-center text-white py-2">
                      <p className="text-lg font-semibold">{season.name}</p>
                      <p className="text-sm">{season.episode_count} episodes</p>
                    </div>
                  </div>
                ))}
            </div>
            {/* Scroll Buttons */}
            {details.seasons.length > 7 && (
              <>
                {showSeasonLeftButton && (
                  <button
                    onClick={scrollSeasonLeft}
                    className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
                    aria-label="Scroll Seasons Left"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                )}
                {showSeasonRightButton && (
                  <button
                    onClick={scrollSeasonRight}
                    className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
                    aria-label="Scroll Seasons Right"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Cast Section */}
      <div className="py-6 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative ">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Cast</h2>
        <div
          ref={scrollContainerRef}
          className="w-full flex overflow-x-auto space-x-4 py-2 snap-x no-scrollbar"
          onScroll={handleScroll}
        >
          {cast.length > 0 ? (
            cast.map((member) => (
              <div
                key={member.id}
                className="relative flex-none w-32 sm:w-40 h-48 sm:h-60 bg-gray-800 rounded-lg overflow-hidden shadow-lg snap-start"
              >
                <img
                  src={member.profile_path ? `${imageUrl}${member.profile_path}` : `${smallPoster.src}`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 bg-gradient-to-t from-black via-black opacity-80 w-full text-center text-white py-2">
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-sm">{member.character}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-lg text-center w-full">No cast available</p>
          )}
        </div>
        {/* Scroll Buttons */}
        {cast.length > 7 && (
          <>
            {showLeftButton && (
              <button
                onClick={scrollLeft}
                className="hidden sm:block absolute  left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-300"
                aria-label="Scroll Cast Left"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            {showRightButton && (
              <button
                onClick={scrollRight}
                className="hidden sm:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-1 sm:p-2 rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-300"
                aria-label="Scroll Cast Right"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </>
        )}
      </div>

      {/* Trailer Modal */}
      {isTrailerPlaying && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="relative w-full max-w-3xl sm:max-w-4xl">
            <button
              onClick={() => setIsTrailerPlaying(false)}
              className="absolute top-0 right-0 mt-4 mr-4 text-white text-3xl"
              aria-label="Close Trailer"
            >
              <i className="fas fa-times"></i>
            </button>
            <iframe
              className="w-full h-64 sm:h-80 md:h-96"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Overview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="relative w-full max-w-3xl sm:max-w-4xl bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg">
            <button
              onClick={closeOverviewModal}
              className="absolute top-4 right-4 text-white text-3xl"
              aria-label="Close Overview"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {('title' in details ? details.title : details.name) || 'Details'}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">{details.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
