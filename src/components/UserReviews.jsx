import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';

export default function UserReviews() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [moviePosters, setMoviePosters] = useState({});
  const [expandedReview, setExpandedReview] = useState(null); 
  const IMAGE_API = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    const fetchUserReviews = async () => {
      const reviewsCollection = collection(db, 'reviews');
      const q = query(reviewsCollection, where('author', '==', userId));
      onSnapshot(q, (snapshot) => {
        const userReviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReviews(userReviews);

        userReviews.forEach(async (review) => {
          if (review.movieId && !moviePosters[review.movieId]) {
            try {
              const movieResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${review.movieId}?api_key=37d4e056c75de20005e582d0fe41d3f7`
              );
              setMoviePosters((prevState) => ({
                ...prevState,
                [review.movieId]: movieResponse.data.poster_path,
              }));
            } catch (error) {
              console.error('Error fetching movie poster:', error);
            }
          }
        });
      });
    };

    fetchUserReviews();
  }, [userId, moviePosters]);

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  const handleMovieClick = (movieId, movieTitle, moviePoster) => {
    navigate('/moviedetails', {
      state: {
        movie: { id: movieId, title: movieTitle, poster_path: moviePoster },
      },
    });
  };

  return (
    <div className="rightcol" style={{ margin: "2rem", width: "85vw" ,height: '75vh',overflowY:'auto' }}>
      <h3>Reviews Given by {userId}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card
              key={review.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'row',
                width: '45%',
                height: 'auto',
                
              }}
            >
              
              <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '1rem',
                    borderBottom: '1px solid black',
                    alignItems: 'center', paddingBottom:'0.5rem'
                  }}
                >
                  
                 <div style={{marginRight: '1rem',width: '50px',height: '50px',borderRadius: '50%',overflow: 'hidden',
                  backgroundColor: '#ccc',display: 'flex',justifyContent: 'center',alignItems: 'center',}}>
                  {review.userProfilePic ? (
                    <img
                      src={review.userProfilePic}
                      alt="User Profile"
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <span style={{ fontSize: '24px', color: '#fff' }}>
                      {review.author[0].toUpperCase()}
                    </span>
                  )}
                  </div>
                  <div>
                    <h5>{review.author}</h5>
                  </div>
                </div>

                
                <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < review.rating ? 'gold' : '#ccc' }}>★</span>
                  ))}
                </div>

                
                <Card.Body
                  style={{
                    padding: '0',
                    maxHeight: expandedReview === review.id ? 'none' : '120px',
                    overflow: expandedReview === review.id ? 'visible' : 'hidden',
                  }}
                >
                  <Card.Text style={{ height: expandedReview === review.id ? 'auto' : '7vh' }}>
                    {expandedReview === review.id
                      ? review.content
                      : review.content.length > 100
                      ? review.content.substring(0, 100) + '...'
                      : review.content}
                  </Card.Text>
                  <Button
                    onClick={() => toggleReviewExpansion(review.id)}
                    style={{
                      padding: '0',
                      color: 'white',
                      backgroundColor: '#007bff',
                      width: '30%',
                    }}
                  >
                    {expandedReview === review.id ? 'Read Less' : 'Read More'}
                  </Button>
                </Card.Body>
              </div>

             
              <div
                style={{ width: '150px', marginLeft: '1rem', cursor: 'pointer' }}
                onClick={() => handleMovieClick(review.movieId, review.movieTitle, moviePosters[review.movieId])}
              >
                <img
                  src={
                    moviePosters[review.movieId]
                      ? IMAGE_API + moviePosters[review.movieId]
                      : 'https://via.placeholder.com/100x150'
                  }
                  alt={review.movieTitle}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>
            </Card>
          ))
        ) : (
          <p>No reviews found for this user.</p>
        )}
      </div>
    </div>
  );
}
