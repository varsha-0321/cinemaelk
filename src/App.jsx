import './App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login';
import MovieDetails from './components/moviedetail';
import Signup from './components/signup';
import Home from './components/Home';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import home from './assets/home.png';
import video from './assets/videos.png';
import account from './assets/profile.png';
import logo from './assets/logo.png';
import Title from './assets/title.png';
import { Container, Navbar, Button } from "react-bootstrap";
import UserReviews from './components/UserReviews';
import { Reviewspage } from './components/reviewspage'
import MyReviews from './components/myreviews';
function App() {
  const [user, setUser] = useState('');
  const location = useLocation(); 
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setUser(userEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };


  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      
      {!isAuthPage && (
        <>
          <Navbar href="/" bg="light" variant="light" style={{ margin: '0.5rem 0.5rem', borderBottom: '1px solid black' ,width:'98vw'}}>
            <Container style={{ marginLeft: '3rem' }}>
              <Navbar.Brand href="/">
                <img alt="Logo" src={logo} width="60" height="60" className="d-inline-block align-top" />{' '}
                <img alt="Title" src={Title} width="120" height="60" className="d-inline-block align-top" />
              </Navbar.Brand>
              {user && (
                <Button    style={{ marginLeft: '3rem', width: '13%' }} onClick={handleLogout} className="logoutbutton">
                  Logout
                </Button>
              )}
            </Container>
          </Navbar>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
          
            <div className="leftcol" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', 
              width: '10%', borderRight: '1px solid black',  }}>
              <img src={home} onClick={()=>navigate('/')}   alt="Home" height={100} width={95} />
              <img src={video} onClick={()=>navigate('/reviews')} alt="Videos" height={100} width={95} />
              <img src={account} onClick={()=>navigate('/my')} alt="Account" height={100} width={95} />
            </div>
            
            <div style={{display:'flex'}}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/moviedetails' element={<MovieDetails />} />
                <Route path="/user-reviews/:userId" element={<UserReviews />} />
                <Route path='/reviews' element={<Reviewspage/>}/>
                <Route path='/my' element={<MyReviews/>}/>
              </Routes>
            </div>
          </div>
        </>
      )}

      
      {isAuthPage && (
        <Routes>
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/signup' element={<Signup setUser={setUser} />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
