/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './App.css';
import Gifs from './components/gifs';
import { GetGlobalContext } from './components/globalContext';
import Header from './components/header';
import Loader from './components/loader';

function App() {
  const { state, fetchGif } = GetGlobalContext();

  useEffect(() => {
    function updateScrollPosition(e) {
      if (window.innerHeight + e?.target?.documentElement?.scrollTop + 1 >= e?.target?.documentElement?.scrollHeight) {
        if (state?.gifs?.data?.length !== state?.gifs?.pagination?.total_count)
          fetchGif();
      }
    }

    if (typeof window !== 'undefined') {
      window?.addEventListener("scroll", updateScrollPosition, false);
      return function cleanup() {
        window?.removeEventListener("scroll", updateScrollPosition, false);
      };
    }
  }, [state]);


  return (
    <div className="App">
      <div className="appBody">
        <Header />
        <Gifs />
      </div>
      <Loader />
    </div>
  );
}

export default App;
