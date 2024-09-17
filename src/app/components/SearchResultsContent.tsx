"use client";

import { useState, useEffect } from 'react';
import { SearchResult } from '../types/types';
import largePoster from "../assets/posterLogoLarge.png";
import { fetchSearch } from '../api/tmdb';

interface Props {
  results: SearchResult[];
  query: string;
  currentPage: number;
}

const SearchResultsContent: React.FC<Props> = ({ results, query, currentPage }) => {
  const [page, setPage] = useState<number>(currentPage);
  const [searchResults, setSearchResults] = useState<SearchResult[]>(results);
  const imageUrlBase = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || '';

  // Filter out results where media_type is "person"
  const filteredResults = searchResults.filter(result => result.media_type !== 'person');

  const fetchResults = async (query: string, page: number) => {
    try {
      const searchResults = await fetchSearch(query, page);
      return searchResults?.results.filter((result: { media_type: string; }) => result.media_type !== 'person') || [];
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    }
  };

  const handleNextPage = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const handlePreviousPage = async () => {
    const previousPage = Math.max(page - 1, 1);
    setPage(previousPage);
  };

  const handleItemClick = (type: string, id: number) => {
    window.location.href = `/details?type=${type}&id=${id}`;
  };

  useEffect(() => {
    // Fetch new results whenever the page changes
    const fetchPageResults = async () => {
      const newResults = await fetchResults(query, page);
      setSearchResults(newResults);
    };

    fetchPageResults();
  }, [query, page]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => {
            const releaseYear = result.release_date ? (result.release_date as string).split('-')[0] : 'Unknown';

            return (
              <div
                key={result.id}
                onClick={() => handleItemClick(result.media_type, result.id)}
                className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                <img
                  src={result.poster_path ? `${imageUrlBase}${result.poster_path}` : `${largePoster.src}`}
                  alt={result.title || result.name}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-90 transition-opacity duration-300 p-4">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white mb-1">{result.title || result.name}</h2>
                    <p className="text-sm text-gray-300">{releaseYear}</p>
                    <div className="flex items-center justify-center mt-2">
                      {result.vote_average && (
                        <>
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <p className="text-sm text-gray-300">{result.vote_average.toFixed(1)} / 10</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white text-center">No results found...</p>
        )}
      </div>
      <div className="relative flex justify-center text-center mt-6 space-x-4">
        <button 
          onClick={handlePreviousPage} 
          className="bg-gray-700 text-green px-4 py-2 rounded disabled:opacity-50" 
          disabled={page === 1}
          aria-label="Previous Page"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <p className="left-1/2 mt-2 transform -translate-x-1/2 text-green">{page}</p>
        <button 
          onClick={handleNextPage} 
          className="bg-gray-700 text-green px-4 py-2 rounded"
          aria-label="Next Page"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </>
  );
};

export default SearchResultsContent;
