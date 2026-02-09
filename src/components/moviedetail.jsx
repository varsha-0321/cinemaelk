import React, { useEffect, useState } from 'react';
import { Card, Button, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import '../App.css';

export default function MovieDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie } = location.state || {};

  const IMAGE_API = 'https://image.tmdb.org/t/p/w500';
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [username, setUsername] = useState('User'); 

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || user.email || 'User');
    }

    if (movie) {
      const fetchData = async () => {
        const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=37d4e056c75de20005e582d0fe41d3f7`);
        setCast(castResponse.data.cast);

        const similarResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=37d4e056c75de20005e582d0fe41d3f7`);
        setSimilarMovies(similarResponse.data.results);

        const reviewsCollection = collection(db, 'reviews');
        const q = query(reviewsCollection, where("movieId", "==", movie.id));
        onSnapshot(q, (snapshot) => {
          const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserReviews(reviews);
        });

        setLoading(false);
      };
      fetchData();
    }
  }, [movie]);

  const handlePostReviewClick = () => {
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (reviewContent.trim() === '' || rating.trim() === '') {
      alert('Please fill in both the review and rating.');
      return;
    }

    const newReview = {
      author: username,
      content: reviewContent,
      rating: rating,
      movieId: movie.id
    };

    await addDoc(collection(db, 'reviews'), newReview);
    setShowReviewForm(false);
    setRating('');
    setReviewContent('');
  };

  const handleUserClick = (userId) => {
    navigate(`/user-reviews/${userId}`);
  };

  return (
    <div style={{ marginTop: '0.5rem', display: 'flex', height: '85vh', overflowX: 'scroll', width: '90vw', scrollbarWidth: 'none' }}>
      {/* Left Column */}
      <div style={{ width: '55%', overflowY: 'auto', maxHeight: '78vh', marginRight: '20px', borderRight: '3px solid #ccc', scrollbarWidth: 'none' }}>
        <Card style={{ marginBottom: '20px', border: 'none' }}>
          <Card.Img src={IMAGE_API + movie.poster_path} style={{ width: '50%', height: '65vh', paddingLeft: '1rem', border: 'none' }} />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Text><strong>Movie Overview</strong><br />{movie.overview}</Card.Text>
            <Button onClick={handlePostReviewClick} style={{ background: '#f15a24', color: 'white', border: '2px solid white', width: '36%', height: '6vh' }}>Post Review</Button>
          </Card.Body>
        </Card>

        <h3>Cast and Crew</h3>
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px', display: 'flex', alignItems: 'center', marginBottom: '20px', overflowY: 'hidden', scrollbarWidth: 'none' }}>
          {cast.map((member) => (
            <div key={member.id} style={{ display: 'inline-block', textAlign: 'center', margin: '10px' }}>
              <img src={IMAGE_API + member.profile_path} alt={member.name} style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div>{member.name}</div>
            </div>
          ))}
        </div>

        <h3>Similar Movies</h3>
        <Row style={{ display: 'flex', flexWrap: 'wrap' }}>
          {similarMovies.map((similarMovie) => (
            <div key={similarMovie.id} style={{ width: '30%', marginBottom: '20px' }}>
              <Card onClick={() => navigate('/moviedetails', { state: { movie: similarMovie } })} style={{ cursor: 'pointer', border: 'none' }}>
                <Card.Img variant="top" src={IMAGE_API + similarMovie.poster_path} />
                <Card.Body>
                  <Card.Title>{similarMovie.title}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </div>

      {/* Right Column */}
      <div style={{ width: '40%', paddingLeft: '20px', overflowY: 'auto', maxHeight: '80vh', scrollbarWidth: 'none' }}>
        <h4>Reviews By Cinema Elk Users</h4>
        {userReviews.length > 0 ? (
          userReviews.map((review) => (
            <Card key={review.id} style={{ border: 'none', marginBottom: '0', marginTop: '1rem', }}>
              <p>{review.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',paddingBottom:"1rem" }}>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleUserClick(review.author)}>
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
                <div>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < review.rating ? 'gold' : '#ccc' }}>★</span>
                  ))}
                </div>
              </div>
              <div style={{ borderBottom: '2px solid black', marginTop: '10px' }}></div>
            </Card>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      {/* Review Form  */}
      {showReviewForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '40%', textAlign: 'center' }}>
            <h3>Enter Review</h3>
            <textarea 
              placeholder="Enter review" 
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              style={{ width: '100%', height: "15vh", border: 'none', borderBottom: '2px solid black', marginBottom: '15px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              Rating
              <input
                type="number"
                value={rating}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 1 && value <= 5)) {
                    setRating(value);
                  }
                }}
                style={{ width: '60px', border: '2px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
              /> out of 5
            </div>
            <Button onClick={handleSubmitReview} style={{ marginTop: '15px', background: '#f15a24', color: 'white', border: '2px solid white' }}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
}
