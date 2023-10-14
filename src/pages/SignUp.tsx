import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../providers/Auth';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { UserCredential } from 'firebase/auth';
import GetLinkDetails from '../providers/LinkInfo';

//handle account sign up and redirect appropriately

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState(false); 
  const auth = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (auth && auth.currentUser && auth.currentUser.emailVerified) {
      setIsEmailVerified(true);
    }
  }, [auth]);

  const handleSignUp = async (e: SyntheticEvent) => {
    e.preventDefault();
    
    setIsSigningUp(true);
    
    try {
      if (auth) {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (userCredential.user) {
          await sendEmailVerification(userCredential.user);
          setVerificationMessage('A verification email has been sent to your email address. Please check your inbox.');
          
          setIsSigningUp(false);

          navigate('/sign-in');

        } else {

        // decided to hide actual error details to avoid brute-force attack. Alternative way is to install 2FA or block account after 5 tries.
          setError('An error occurred during account creation. Please try again later.');
          setIsSigningUp(false); 
        }
      } else {
        setError('Authentication failed. Please try again later or check your connection.');
        setIsSigningUp(false); 
      }
    } catch (error) {
      setIsSigningUp(false);
      setError('An unknown error occurred. Please verify credentials and try again later.');
    }
  };

  return (
    <div className="start">
      <GetLinkDetails />
      <main>
        <Helmet>
          <title>Sign Up - Turing Test Web App</title>
          <meta name="description" content="Web site created for Turing test" />
          <link rel="stylesheet" href="/dist/css/swipe.min.css" />
          <link rel="apple-touch-icon" href="/images/logo.png" />
        </Helmet>
        <div className="layout">
          <div className="main order-md-1">
            <div className="start">
              <div className="container">
                <div className="col-md-12">
                  <div className="content">
                    <img src="/images/logo.png" alt="Logo" />
                    <h1>Sign Up</h1>
                    <div className="third-party"></div>
                    <form onSubmit={handleSignUp}>
                      <div className="form-group">
                        <input
                          type="email"
                          id="inputEmail"
                          className="form-control"
                          placeholder="Email Address"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="btn icon">
                          <i className="material-icons">mail_outline</i>
                        </button>
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          id="inputPassword"
                          className="form-control"
                          placeholder="Password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn icon">
                          <i className="material-icons">lock_outline</i>
                        </button>
                      </div>
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                      {verificationMessage && <p style={{ color: 'green' }}>{verificationMessage}</p>}
                      
                      <button
                        type="submit"
                        className="btn button"
                        style={{ color: '#ffffff', backgroundColor: '#8321F3' }}
                        disabled={isSigningUp}
                      >
                        {isSigningUp ? 'Creating Account' : 'Sign Up'}
                      </button>
                      
                      <div className="callout">
                        <span>
                          Already have an account?{' '}
                          <Link to="/sign-in" style={{ color: '#8321F3' }}>
                            Sign In
                          </Link>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="aside order-md-2">
            <div className="container">
              <div className="col-md-12">
                <div className="preference">
                  <h2>Hello, HR!</h2>
                  <p>This is my entry for iOS developer Test!</p>
                  <Link to="/sign-in" className="btn button" style={{ color: '#8321F3' }}>
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignUp;
