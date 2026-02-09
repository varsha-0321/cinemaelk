import { Col, Container, Row } from "react-bootstrap";
import loginPageImg from '../assets/login.png';
import formImg from '../assets/form.png';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem('userEmail', email);
        setUser(email);
        navigate('/');
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
        console.error("Login error:", err);
      });
  }

  return (
    <div className="loginpage">
      <Container className="loginpagecontainer">
        <Row>
          <Col>
            <img src={loginPageImg} alt="Login Page" style={{ width: '100%', height: '100%', marginLeft: '1rem' }} />
          </Col>
          <Col style={{ marginTop: '9rem', padding: '2rem' }}>
            <img src={formImg} alt="Login Form" style={{ marginLeft: '4rem', marginBottom: '2rem' }} />
            <Form style={{ display: "flex", alignItems: 'center', flexDirection: 'column' }}>
              <div style={{ display: "flex", marginBottom: '2rem' }}>
                <Form.Group className="mb-3" controlId="formBasicEmail" style={{ width: '50%' }}>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: '50%', marginLeft: '2rem' }}>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    required
                  />
                </Form.Group>
              </div>
              <button type="button" className="loginbutton" onClick={handleLogin}>
                Login Now <span style={{ marginLeft: '3rem' }}>&#8594;</span>
              </button>
            </Form>
            <div style={{ display: "flex", justifyContent: 'center', padding: 25, color: 'white' }}>
              Join the club,<a href="/signup" style={{ color: "white", marginLeft: '0.5rem' }}> Click here!</a>
            </div>          
          </Col>
        </Row>
      </Container>
    </div>
  );
}