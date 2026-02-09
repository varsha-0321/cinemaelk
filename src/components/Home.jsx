import React, { useState, useEffect } from "react";
import { Card,} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import '../App.css';

export default function Home() {
  const [user, setUser] = useState('');
  const [nowMovies, setNowMovies] = useState([]); 
  const [popularMovies, setPopularMovies] = useState([]);   
  const [topRatedMovies, setTopRatedMovies] = useState([]); 
  const [upcomingMovies, setUpcomingMovies] = useState([]); 
  const navigate = useNavigate();

  const IMAGE_API = 'https://image.tmdb.org/t/p/w500';
  const NOWPLAYINGMOVIE_API = 'https://api.themoviedb.org/3/movie/now_playing?api_key=37d4e056c75de20005e582d0fe41d3f7';
  const POPULARMOVIE_API = 'https://api.themoviedb.org/3/movie/popular?api_key=37d4e056c75de20005e582d0fe41d3f7';
  const TOPRATINGMOVIE_API = 'https://api.themoviedb.org/3/movie/top_rated?api_key=37d4e056c75de20005e582d0fe41d3f7';
  const UPCOMINGMOVIE_API = 'https://api.themoviedb.org/3/movie/upcoming?api_key=37d4e056c75de20005e582d0fe41d3f7';

   
  
    useEffect(() => {
      const user = localStorage.getItem('userEmail');
      if (!user) {
      navigate('/login');
      }
      },[]);
  

  useEffect(() => {
    axios.get(NOWPLAYINGMOVIE_API).then((resp) => {
      setNowMovies(resp.data.results); 
    });
    axios.get(POPULARMOVIE_API).then((resp) => {
      setPopularMovies(resp.data.results); 
    });
    axios.get(TOPRATINGMOVIE_API).then((resp) => {
      setTopRatedMovies(resp.data.results); 
    });
    axios.get(UPCOMINGMOVIE_API).then((resp) => {
      setUpcomingMovies(resp.data.results); 
    });
  }, []);

  return (
    <div>
      

        <div className="rightcol" style={{ display: 'flex', flexDirection: 'column', height: '85vh', overflowX: 'scroll', scrollBehavior: 'smooth', width: '90vw', whiteSpace: 'nowrap' }}>
          
          <div>
            <h1>Now Playing</h1>
            <div style={{ display: "flex", flexDirection: 'row', overflowX: "scroll", scrollBehavior: "smooth", width: '90vw', whiteSpace: 'nowrap', padding: "1rem" }} className="hide-scrollbar">
              {nowMovies.map(nowMovie => (
                <div key={nowMovie.id}>
                  <Card onClick={() => navigate('/moviedetails', { state: { movie: nowMovie } })}
                   style={{ width: '16rem', padding: 20, height: '100%', overflow: 'hidden', margin: 10,
                    border: 'none' }}>
                    <Card.Img src={IMAGE_API + nowMovie.poster_path} width={80} />
                    <Card.Title>{nowMovie.title}</Card.Title>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          
          <div>
            <h1>Popular Movies</h1>
            <div style={{ display: "flex", flexDirection: 'row', overflowX: "scroll", scrollBehavior: "smooth", 
            width: '90vw', whiteSpace: 'nowrap', padding: "1rem" }} 
              className="hide-scrollbar">
              {popularMovies.map(popularMovie => (
                <div key={popularMovie.id}>
                  <Card onClick={() => navigate('/moviedetails', { state: { movie: popularMovie } })}
                   style={{ width: '16rem', padding: 20, height: '100%', overflow: 'hidden', margin: 10,
                    border: 'none' }}>
                    <Card.Img src={IMAGE_API + popularMovie.poster_path} width={80} />
                    <Card.Title>{popularMovie.title}</Card.Title>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          
          <div>
            <h1>Top Rated</h1>
            <div style={{ display: "flex", flexDirection: 'row', overflowX: "scroll",
               scrollBehavior: "smooth", width: '90vw', whiteSpace: 'nowrap', padding: "1rem" }}
                className="hide-scrollbar">
              {topRatedMovies.map(topRatedMovie => (
                <div key={topRatedMovie.id}>
                  <Card onClick={() => navigate('/moviedetails', { state: { movie: topRatedMovie } })} 
                  style={{ width: '16rem', padding: 20, height: '100%', overflow: 'hidden', margin: 10, border: 'none' }}>
                    <Card.Img src={IMAGE_API + topRatedMovie.poster_path} width={80} />
                    <Card.Title>{topRatedMovie.title}</Card.Title>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          
          <div>
            <h1>Upcoming Movies</h1>
            <div style={{ display: "flex", flexDirection: 'row', overflowX: "scroll", 
              scrollBehavior: "smooth", width: '90vw', whiteSpace: 'nowrap', padding: "1rem" }} 
              className="hide-scrollbar">
              {upcomingMovies.map(upcomingMovie => (
                <div key={upcomingMovie.id}>
                  <Card onClick={() => navigate('/moviedetails', { state: { movie: upcomingMovie } })} style={{ width: '16rem', padding: 20, height: '100%', overflow: 'hidden', margin: 10, border: 'none' }}>
                    <Card.Img src={IMAGE_API + upcomingMovie.poster_path} width={80} />
                    <Card.Title>{upcomingMovie.title}</Card.Title>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  
  );
} 