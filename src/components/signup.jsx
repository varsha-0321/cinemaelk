import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import loginPageImg from '../assets/login.png';
import formImg from '../assets/form.png';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function Signup({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate();

  async function handlesubmit() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullname
      });

      alert("Signup successful!");
      localStorage.setItem('userEmail', email);
      localStorage.setItem('fullName', fullname);
      setUser(fullname); 

      navigate('/'); 
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Signup error:", error);
    }
  }

  return (
    <div className="loginpage">
      <Container className="loginpagecontainer">
        <Row>
          <Col>
            <img src={loginPageImg} style={{ width: '100%', height: '100%', marginLeft: '1rem' }} alt="Login Page" />
          </Col>
          <Col style={{ marginTop: '9rem', padding: '2rem' }}>
            <img src={formImg} style={{ marginLeft: '4rem', marginBottom: '1.5rem' }} alt="Form Icon" />
            <Form style={{ display: "flex", alignItems: 'center', flexDirection: 'column' }}>
              <div style={{ display: "flex", marginBottom: '0.5rem' }}>
                <Form.Group className="mb-3" controlId="formBasicEmail" style={{ width: '50%' }}>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: '50%', marginLeft: '2rem' }}>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    value={password}
                  />
                </Form.Group>
              </div>

              <Form.Group className="mb-3" controlId="formBasicFullNames" style={{ width: '73%' }}>
                <Form.Control
                  type="text"
                  placeholder="Enter Full Name"
                  onChange={(e) => setFullname(e.currentTarget.value)}
                  value={fullname}
                />
              </Form.Group>

              <button type="button" className="loginbutton" onClick={handlesubmit}>
                Join the club <span style={{ marginLeft: '3rem' }}>&#8594;</span>
              </button>
            </Form>

            <div style={{ display: "flex", justifyContent: 'center', padding: 25, color: 'white' }}>
              Already a member?
              <a href="/login" style={{ color: "white", marginLeft: '0.5rem' }}>Click here!</a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
