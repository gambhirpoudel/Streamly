"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchallTrending, fetchMovieVideos, fetchTvVideos, fetchMovieDetails, fetchTvDetails } from '../api/tmdb';
import { MediaItem, MovieDetails, TVShowDetails, Video } from '../types/types';

const TrendingMedia: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [mediaDetailsMap, setMediaDetailsMap] = useState<Map<number, MovieDetails | TVShowDetails>>(new Map());
  const [trailerKeys, setTrailerKeys] = useState<Record<number, string | null>>({});
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState<boolean>(false);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getMediaAndTrailers = async () => {
      try {
        const trendingMedia = await fetchallTrending();
        setTrending(trendingMedia);

        const detailsPromises = trendingMedia.map((media: MediaItem) =>
          media.media_type === 'movie' ? fetchMovieDetails(media.id) : fetchTvDetails(media.id)
        );
        const detailsArray = await Promise.all(detailsPromises);

        const detailsMap = new Map<number, MovieDetails | TVShowDetails>();
        detailsArray.forEach(detail => {
          if (detail) {
            detailsMap.set(detail.id, detail);
          }
        });
        setMediaDetailsMap(detailsMap);

        const trailerKeysMap: Record<number, string | null> = {};
        for (const media of trendingMedia) {
          const mediaVideos = media.media_type === 'movie' 
            ? await fetchMovieVideos(media.id) 
            : await fetchTvVideos(media.id);
          
          const trailer = mediaVideos.find((video: Video) =>
            (video.name === 'Official Trailer' || (video.type === 'Trailer' && video.site === 'YouTube'))
          );

          trailerKeysMap[media.id] = trailer ? trailer.key : null;
        }
        setTrailerKeys(trailerKeysMap);
      } catch (error) {
        console.error('Error fetching media data:', error);
      }
    };

    getMediaAndTrailers();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (!isTrailerPlaying) {
      intervalId = setInterval(() => {
        setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % trending.length);
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [trending, isTrailerPlaying]);

  const currentMedia = trending[currentMediaIndex];
  const trailerKey = currentMedia ? trailerKeys[currentMedia.id] : null;
  const mediaDetails = currentMedia ? mediaDetailsMap.get(currentMedia.id) : null;
  const imageUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || '';

  const handleWatchNow = () => {
    if (currentMedia && trailerKey) {
      setActiveTrailerKey(trailerKey);
      setIsTrailerPlaying(true);
    }
  };

  const handlePlayNow = () => {
    if (currentMedia && mediaDetails) {
      const videoId = currentMedia.id;
      router.push(`/details?type=${currentMedia.media_type}&id=${videoId}`);
    }
  };

  return (
    <div className="relative w-full h-[90vh] text-white bg-black overflow-hidden">
      {currentMedia && (
        <div className="relative w-full h-full">
          {isTrailerPlaying && activeTrailerKey ? (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
              <div className="relative w-full max-w-4xl h-3/4 bg-black rounded-lg shadow-lg">
                <button
                  onClick={() => setIsTrailerPlaying(false)}
                  className="absolute top-4 right-4 text-white text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          ) : (
            <img
              src={`${imageUrl}${currentMedia.backdrop_path}`}
              alt={currentMedia.title || currentMedia.name}
              className="w-full h-full object-cover opacity-70 transition-opacity duration-500 ease-in-out"
            />
          )}
          <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black to-transparent w-full">
            <div className="flex flex-col sm:flex-row items-start mb-4">
              <img
                src={`${imageUrl}${currentMedia.poster_path}`}
                alt={currentMedia.title || currentMedia.name}
                className="hidden sm:block w-32 h-48 object-cover rounded-lg shadow-lg border border-gray-700 mb-4 sm:mb-0 sm:mr-4"
              />
              <div className="flex-1">
                <h2 className="text-white font-bold text-xl sm:text-2xl mb-2">{currentMedia.title || currentMedia.name}</h2>
                <div className="flex items-center mb-2 text-sm sm:text-base">
                  <i className="fas fa-star text-yellow-400 mr-2"></i>
                  <p className="text-white">{currentMedia.vote_average.toFixed(1)}</p>
                  <span className="mx-1"></span>
                  <i className="fas fa-calendar-alt text-white mr-2"></i>
                  <p className="text-white">{currentMedia.release_date || currentMedia.first_air_date}</p>
                  <span className="mx-1"></span>
                  <i className="fas fa-language text-white mr-2"></i>
                  <p className="text-white">{mediaDetails?.original_language.toUpperCase()}</p>
                  <span className="mx-1"></span>
                  {currentMedia.media_type === 'movie' ? (
                    <i className="fas fa-film text-white mr-2"></i>
                  ) : (
                    <i className="fas fa-tv text-white mr-2"></i>
                  )}
                  <p className="text-white">{currentMedia.media_type === 'movie' ? 'Movie' : 'TV Show'}</p>
                </div>
                <div className="flex flex-wrap max-w-[300px] sm:max-w-full">
                  {mediaDetails?.genres.map((genre) => (
                    <span key={genre.id} className="bg-mixed-200 text-gray-300 px-2 py-1 rounded mr-2 mb-2 text-xs sm:text-sm whitespace-nowrap">
                      {genre.name}
                    </span>
                  ))}
                </div>
                <p className="text-body mb-4 text-xs sm:text-sm max-w-[300px] sm:max-w-[600px] overflow-auto">{currentMedia.overview}</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                    <button
                      onClick={handleWatchNow}
                      className="bg-white text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gray-300 transition-colors duration-300 flex items-center w-full sm:w-auto"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Play Trailer
                    </button>
                    <button
                      onClick={handlePlayNow}
                      className="bg-opacity-15 text-white px-4 py-2 rounded-lg shadow-lg bg-white hover:bg-opacity-30 transition-colors duration-300 flex items-center w-full sm:w-auto border border-white"
                    >
                      <i className="fas fa-info-circle mr-2"></i>
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingMedia;
