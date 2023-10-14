import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GetLinkDetails() {

  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const trackName = urlSearchParams.get('trackName');
  const artistName = urlSearchParams.get('artistName');

  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect is running.');

    if (trackName && artistName) {
      console.log('Track Name:', trackName);
      console.log('Artist Name:', artistName);

      // Save artistName and trackName to local storage
      localStorage.setItem('artistName', artistName);
      localStorage.setItem('trackName', trackName);

      navigate('/'); 
    }
  }, [trackName, artistName, navigate]);

  return null; 
}

export default GetLinkDetails;
