import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // A snippet of code which runs on a specific condition/variable
  useEffect(() => {
    // if [](means we leave brackets empty), run once when row loads, and dont run again
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // axios.get(fetchUrl) -> baseUrl/fetchUrl

      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  
  //console.table(movies);
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          //https://www.youtube.com/watch?v=XtMThy8QKqU&t=9574s
          // in above link the videoId is -> "XtMThy8QKqU&t=9574s"
          const urlParams = new URLSearchParams(new URL(url).search); 
          setTrailerUrl(urlParams.get("v")); // v = XtMThy8QKqU
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {/** several row__posters */}

        {movies.map((movie) => (
          <img
            key={movie.id} //used for optimization, makes the site lil bit fast
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            // what we are doing here is basically checking if the row is large (by isLargeRow)
            // if it is large then change the className -> to row_posterLarge

            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}

      {/** container -> poster */}
    </div>
  );
}

export default Row;
