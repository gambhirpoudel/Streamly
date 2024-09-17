import React from 'react';

import TrendingMovies from './components/TrendingMovies';
import TrendingTV from './components/TrendingTV';
import TopRatedMovies from './components/TopRatedMovies';
import Footer from './components/Footer';
import TrendingMedia from './components/AllTrending';

const Index = () => {
  return (
    <main className="bg-mixed-100 min-h-screen flex flex-col">
      <div className="flex-1">
        <TrendingMedia />
        <TrendingMovies />
        <TrendingTV/>
        <TopRatedMovies/>
        <Footer/>
      </div>
    </main>
  );
};

export default Index;