import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../providers/Auth';
import { sendEmailVerification, signOut } from 'firebase/auth';


// account verification here
function Verify() {
  const [isResending, setIsResending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();


//clear aunthentication and handle all verification issues
  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };


  // resend verification code
  const handleResendVerification = async () => {
    setIsResending(true);

    if (auth && auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
      } catch (error) {
        console.error('Error sending email verification:', error);
      } finally {
        setIsResending(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkEmailVerification = async () => {
      if (isMounted && auth && auth.currentUser) {
        if (auth.currentUser.emailVerified) {
          return <Navigate to="/" />;
        }
      }
    };

    checkEmailVerification().then(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    const intervalId = setInterval(checkEmailVerification, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [auth]);

  return (
    <div className="start">
      <main>
        <Helmet>
          <title>Verify Email - Turing Test Web App</title>
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
                    <h1>Verify Email Address</h1>
                    <div className="third-party"></div>
                    <form>
                      <button
                        type="submit"
                        className="btn button"
                        style={{ backgroundColor: '#8321F3' }}
                        onClick={handleResendVerification}
                        disabled={isResending || verificationSent}
                      >
                        {isResending
                          ? 'Resending...'
                          : verificationSent
                          ? 'Verification Link Sent'
                          : 'Resend Verification Link'}
                      </button>
                      {verificationSent && (
                        <p style={{ marginTop: '1rem' }}>
                          A verification link has been sent to your email address. Please check your inbox.
                        </p>
                      )}
                      <div className="callout">
                        <span>
                          Don&apos;t have an account?{" "}
                          <button
                            onClick={handleLogout}
                            style={{ color: '#8321F3', backgroundColor: 'inherit', border: '0px' }}
                          >
                            Create Account
                          </button>
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
                  <p>Let Us Know You!</p>
                  <button onClick={handleLogout} className="btn button" style={{ color: '#8321F3' }}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Verify;
