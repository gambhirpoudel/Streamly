"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMovieDetails, fetchmovieCredits, fetchTvcredits, fetchMovieVideos, fetchTvVideos, fetchTvDetails } from '../api/tmdb';
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

        const trailer = videosData?.find((video: Video) =>
          video.name === 'Official Trailer' || (video.type === 'Trailer' && video.site === 'YouTube')
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
    if(type == 'movie'){
      router.push(`/watch?type=${type}&id=${id}`);
    } else{
         router.push(`/watch?type=${type}&id=${id}`);
    }
 
  };


  const openOverviewModal = () => {
    setIsModalOpen(true);
  };

  const closeOverviewModal = () => {
    setIsModalOpen(false);
  };

  if (!details) return null;

  return (
    <div className="relative w-full h-auto pb-8 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <div className="relative w-full h-screen">
        <img
          src={`${imageUrl}${details.backdrop_path}`}
          alt={('title' in details ? details.title : details.name) || 'Details'}
          className="absolute inset-0 w-full h-full object-cover filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black opacity-70"></div>
      </div>

      <div className="absolute top-1/4 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row items-start md:items-center max-w-screen-xl mx-auto">
        <img
          src={details.poster_path ? `${imageUrl}${details.poster_path}` : `${largePoster.src}`}
          alt={('title' in details ? details.title : details.name) || 'Details'}
          className="w-64 h-96 md:w-80 md:h-96 object-cover rounded-lg shadow-2xl border border-gray-800"
        />
        <div className="md:ml-8 mt-6 md:mt-0 flex-1">
          <h1 className="text-white text-body md:text-6xl lg:text-heading font-extrabold mb-4">{('title' in details ? details.title : details.name) || 'Details'}</h1>
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <i className="fas fa-star text-yellow-400 text-xl"></i>
              <p className="text-white text-lg">{details.vote_average.toFixed(1) || 'N/A'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-calendar-alt text-white text-lg"></i>
              <p className="text-white text-lg">{('release_date' in details ? details.release_date : details.first_air_date) || 'Details'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-language text-white text-lg"></i>
              <p className="text-white text-lg">{details.original_language.toUpperCase() || 'N/A'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-2">
            {('genres' in details ? details.genres : []).map(genre => (
              <span
                key={genre.id}
                className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-md"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <div className="overview-container text-gray-300 text-body mb-1" style={{ maxWidth: '800px' }}>
            <p className={` ${showFullOverview ? 'line-clamp-none' : 'line-clamp-3'}`}>
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
          <div className="flex space-x-4">
            <button
              onClick={handleWatchNow}
              className="bg-white text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gray-300 transition-colors duration-300 flex items-center"
            >
              <i className="fas fa-play mr-2"></i>
              Play Trailer
            </button>
           {type !== 'tv' && (
          <button
            onClick={handlePlayNow}
            className="bg-opacity-15 text-white px-4 py-2 rounded-lg shadow-lg bg-white hover:bg-opacity-30 transition-colors duration-300 flex items-center border border-white"
          >
            <i className="fa-solid fa-circle-play mr-2"></i>
            Play Now
          </button>
        )}
          </div>
        </div>
      </div>

{/* Seasons Section */}
{type === 'tv' && details && details.seasons.length > 0 && (
  <div className="mt-40 py-6 max-w-screen-xl mx-auto relative">
    <h2 className="text-white text-4xl font-bold mb-4 text-center">Seasons</h2>
    <div className="relative">
      <div
        className={`w-full flex overflow-x-auto space-x-4 px-4 py-2 ${details.seasons.length > 7 ? 'no-scrollbar' : ''}`}
        ref={scrollSeasonContainerRef}
        onScroll={handleSeasonScroll}
      >
        {details.seasons
          .filter(season => season.name.toLowerCase() !== 'specials')
          .map(season => (
            <div
              key={season.season_number}
              className="relative flex-none w-40 h-60 bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
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
      {details.seasons.some(season => season.name.toLowerCase() !== 'specials') && details.seasons.length > 7 && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          {showSeasonLeftButton && (
            <button
              onClick={scrollSeasonLeft}
              className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
        </div>
      )}
      {details.seasons.some(season => season.name.toLowerCase() !== 'specials') && details.seasons.length > 7 && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {showSeasonRightButton && (
            <button
              onClick={scrollSeasonRight}
              className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
      )}
    </div>
  </div>
)}


      {/* Cast Section */}
      <div className="relative mt-10 py-6 max-w-screen-xl mx-auto">
        <h2 className="text-white text-4xl font-bold mb-4 text-center">Cast</h2>
        <div
          ref={scrollContainerRef}
          className="w-full flex overflow-x-auto space-x-4 px-4 py-2 no-scrollbar"
          onScroll={handleScroll}
        >
          {cast.length > 0 ? (
            cast.map(member => (
              <div
                key={member.id}
                className="relative flex-none w-40 h-60 bg-gray-800 rounded-lg overflow-hidden shadow-lg"
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
            <p className="text-gray-400 text-lg text-center">No cast available</p>
          )}
        </div>
        {/* Scroll Buttons */}
        {showLeftButton && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        {showRightButton && cast.length > 7 ? (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        ): ""}
      </div>

      {/* Trailer Modal */}
      {isTrailerPlaying && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsTrailerPlaying(false)}
              className="absolute top-0 right-0 mt-4 mr-4 text-white text-3xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <iframe
              width="100%"
              height="400"
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl bg-gray-900 p-8 rounded-lg shadow-lg">
            <button
              onClick={closeOverviewModal}
              className="absolute top-0 right-0 mt-4 mr-4 text-white text-3xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-white text-3xl font-bold mb-4">{('title' in details ? details.title : details.name) || 'Details'}</h2>
            <p className="text-gray-300 text-lg">{details.overview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
