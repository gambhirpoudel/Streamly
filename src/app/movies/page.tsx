"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { fetchallMovies } from '../api/tmdb';
import { Movie } from '../types/types';
import BigShimmer from '../components/BigShimmer';
import largePoster from "../assets/posterLogoLarge.png";

const imageUrlBase = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL;

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const getMovies = async () => {
      const moviesList = await fetchallMovies(currentPage);
      setMovies(moviesList);
    };

    getMovies();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleMovieClick = (id: number) => {
    router.push(`/details?type=movie&id=${id}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-white text-center mt-20 mb-6">Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <img
                 src={movie.poster_path ? `${imageUrlBase}${movie.poster_path}` :`${largePoster.src}`}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-90 transition-opacity duration-300 p-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-1">{movie.title}</h2>
                  <p className="text-sm text-gray-300">{movie.release_date.split('-')[0]}</p>
                  <div className="flex items-center justify-center mt-2">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <p className="text-sm text-gray-300">{movie.vote_average.toFixed(1)} / 10</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
         // Show BigShimmer loader while TV shows are being fetched
         Array(12).fill(0).map((_, index) => <BigShimmer key={index} />)
        )}
      </div>
      <div className="relative flex justify-center text-center mt-6 space-x-4">
        <button 
          onClick={handlePreviousPage} 
          className="bg-gray-700 text-green px-4 py-2 rounded disabled:opacity-50" 
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <p className="left-1/2 mt-2 transform -translate-x-1/2 text-green">{currentPage}</p>
        <button 
          onClick={handleNextPage} 
          className="bg-gray-700 text-green px-4 py-2 rounded"
          aria-label="Next Page"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Movies;
