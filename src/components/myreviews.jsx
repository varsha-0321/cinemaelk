import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Editimg from '../assets/edit.png';
import Deleteimg from '../assets/bin.png';

export default function MyReviews() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [moviePosters, setMoviePosters] = useState({});
  const [expandedReview, setExpandedReview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false); 
  const [reviewContent, setReviewContent] = useState(''); 
  const [rating, setRating] = useState(0); 
  const [currentReviewId, setCurrentReviewId] = useState(null); 
  const IMAGE_API = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      const fetchUserReviews = async () => {
        const reviewsCollection = collection(db, 'reviews');
        const q = query(reviewsCollection, where('author', '==', currentUser.displayName || currentUser.email));
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
    }
  }, [currentUser, moviePosters]);

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

  const handleEditClick = (reviewId, content, currentRating) => {
    setCurrentReviewId(reviewId);
    setReviewContent(content);
    setRating(currentRating);
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (reviewContent && rating) {
      try {
        const reviewRef = doc(db, 'reviews', currentReviewId);
        await updateDoc(reviewRef, {
          content: reviewContent,
          rating: Number(rating),
        });
        setShowReviewForm(false); 
      } catch (error) {
        console.error('Error updating review:', error);
      }
    }
  };

  const handleDeleteClick = async (reviewId) => {
    const reviewRef = doc(db, 'reviews', reviewId);
    try {
      await deleteDoc(reviewRef);
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="rightcol" style={{ margin: "2rem", width: "85vw", height: '75vh', overflowY: 'auto' }}>
      <h3>MY REVIEWS </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} style={{ position: 'relative', width: '45%', marginBottom: '1rem' }}>
              <Card style={{ padding: '1rem', display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                  <div style={{ display: 'flex', marginBottom: '1rem', borderBottom: '1px solid black', 
                    alignItems: 'center', paddingBottom: '0.5rem' }}>
                  <div style={{
                    marginRight: '1rem',width: '50px',height: '50px',borderRadius: '50%',overflow: 'hidden',
                    backgroundColor: '#ccc',display: 'flex',justifyContent: 'center',alignItems: 'center',
                    }}
                  >
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
                  <Card.Body style={{ padding: '0', maxHeight: expandedReview === review.id ? 'none' : '120px',
                     overflow: expandedReview === review.id ? 'visible' : 'hidden' }}>
                    <Card.Text style={{ height: expandedReview === review.id ? 'auto' : '7vh' }}>
                      {expandedReview === review.id
                        ? review.content
                        : review.content.length > 100
                        ? review.content.substring(0, 100) + '...'
                        : review.content}
                    </Card.Text>
                  </Card.Body>
                  <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                    <Button onClick={() => toggleReviewExpansion(review.id)} style={{ padding: '0', color: 'white',
                       backgroundColor: '#007bff', width: '30%' }}>
                      {expandedReview === review.id ? 'Read Less' : 'Read More'}
                    </Button>
                    <img
                      src={Editimg} alt="Edit"style={{ cursor: 'pointer', height: '4vh', width: '2vw' }}
                      onClick={() => handleEditClick(review.id, review.content, review.rating)}
                    />
                    <img
                      src={Deleteimg}
                      alt="Delete"
                      style={{ cursor: 'pointer', height: '4vh', width: '2vw' }}
                      onClick={() => handleDeleteClick(review.id)} 
                    />
                  </div>
                </div>
                {moviePosters[review.movieId] && (
                  <div style={{ width: '30%', marginLeft: '10px', cursor: 'pointer' }}>
                    <img
                      src={`${IMAGE_API}${moviePosters[review.movieId]}`}
                      alt="Movie Poster"
                      style={{ width: '100%', height: '100%' }}
                      onClick={() => handleMovieClick(review.movieId, review.movieTitle, moviePosters[review.movieId])}
                    />
                  </div>
                )}
              </Card>
            </div>
          ))
        ) : (
          <div>No reviews available</div>
        )}
      </div>

     
      {showReviewForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '40%', textAlign: 'center' }}>
            <h4>Edit Review</h4>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              rows={4}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ marginBottom: '10px' }}>
              <label>Rating: </label>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
                style={{ width: '50px', marginLeft: '10px' }}
              />
            </div>
            <Button onClick={handleSubmitReview} variant="primary">Submit</Button>
            <Button onClick={() => setShowReviewForm(false)} variant="secondary" style={{ marginLeft: '10px' }}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
