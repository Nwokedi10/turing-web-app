import React, { useState, SyntheticEvent } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../providers/Auth';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import GetLinkDetails from '../providers/LinkInfo';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate(); // Get the navigation function

//handle account signup and send verification mail

  const handleSignIn = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      if (auth) {
        setIsLoggingIn(true); 
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
        if (auth.currentUser && auth.currentUser.emailVerified) {

        // set to expire at the end of the year.
          document.cookie = "uid=auth.currentUser.uid; expires=Sun, 31 Dec 2023 00:00:00 UTC; path=/";
          navigate('/');
        } else {
          navigate('/verify');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('An error occurred during sign-in. Please confirm credentials and try again.');
        setIsLoggingIn(false);
      }
    }
  };

  // if user exists and email verified, send to chat page
  if (auth && auth.currentUser && auth.currentUser.emailVerified) {
    return <Navigate to="/" />;
  } 

  return (
    <div className="start">
      <GetLinkDetails />
      <main>
        <Helmet>
          <title>Sign In - Turing Test Web App</title>
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
                    <h1>Sign In</h1>
                    <div className="third-party"></div>
                    <form onSubmit={handleSignIn}>
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
                      <button
                        type="submit"
                        className="btn button"
                        style={{ backgroundColor: '#8321F3', color: '#ffffff' }}
                        disabled={isLoggingIn} // Disable the button when logging in
                      >
                        {isLoggingIn ? 'Logging In...' : 'Sign In'}
                      </button>
                      <div className="callout">
                        <span>
                          Don&apos;t have an account?{" "}
                          <Link to="/sign-up" style={{ color: '#8321F3' }}>
                            Create Account
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
                  <Link to="/sign-up" className="btn button" style={{ color: '#8321F3' }}>
                    Sign Up
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

export default SignIn;
