import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { FirebaseProvider } from './config/FirebaseConfig';
import { AuthProvider } from './providers/AuthProvider';
import { useAuth, User } from './providers/Auth'; // Import User type
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Chat from './pages/Chat';
import Verify from './pages/Verify';
import GetLinkDetails from './providers/LinkInfo';

function App() {
  const auth = useAuth();
  const user: User | null = auth!.currentUser!;
  const isEmailVerified: boolean = !!user && user.emailVerified;

  // storing the user's uid to cookies helps to keep them logged in within the specified time.
  const cookies = document.cookie.split("; ");
  let uid = "";
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "uid") {
        uid = value;
    }
  }

  return (
    <Routes>
      <Route path="/sign-in" element={uid ? <Navigate to="/" /> : <SignIn />} />
      <Route path="/sign-up" element={uid ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/link" element={<GetLinkDetails />} />
      <Route
        path="/"
        element={
          uid ? (
            <Chat />
          ) : user ? (
            isEmailVerified ? (
              <Chat />
            ) : (
              <Navigate to="/verify" />
            )
          ) : (
            <Navigate to="/sign-in" />
          )
        }
      />
      <Route path="/verify" element={user ? <Verify /> : <Navigate to="/sign-in" />} />
    </Routes>
  );
}

function AppMain() {
  return (
    <Router>
      <FirebaseProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FirebaseProvider>
    </Router>
  );
}

export default AppMain;
