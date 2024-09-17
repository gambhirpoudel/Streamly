import { fetchSearch } from '../api/tmdb';
import { SearchResult } from '../types/types';
import SearchResultsContent from '../components/SearchResultsContent';

interface SearchResultsPageProps {
  searchParams: {
    query?: string;
    page?: string;
  };
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = async ({ searchParams }) => {
  const query = searchParams.query || '';
  const currentPage = parseInt(searchParams.page || '1', 10);
  let results: SearchResult[] = [];

  if (query) {
    try {
      const searchResults = await fetchSearch(query, currentPage);
      results = searchResults?.results || [];
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-white text-center mt-20 mb-6">Search Results</h1>
      <SearchResultsContent results={results} query={query} currentPage={currentPage} />
    </div>
  );
};

export default SearchResultsPage;
