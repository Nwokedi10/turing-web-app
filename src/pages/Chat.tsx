import React, { useState, useEffect, useRef } from "react";
import "./Chats.css";
import ThemeService from "../themes/ThemeService";
import SenderMessage from "../cards/SendMessage";
import MessageModel from "../models/MessageModel";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/Auth';
import LoadLocalSettings from "../providers/LoadLocalSettings";
import { handleOutgoingChat, reLoadLastChat } from "../providers/ChatHandler";


// this is the chat home
const Chats: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [chatInput, setChatInput] = useState<string>("");
  const [chatContainer, setChatContainer] = useState<string>("");
  const [theme, setTheme] = useState<string>("light-mode");
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState<boolean>(false);

  const [trackName, setTrackName] = useState<string | null>(null);
  const [artistName, setArtistName] = useState<string | null>(null);


  // check if last saved message was unresponded to by Cody then resend.
  useEffect(() => {
    LoadLocalSettings.loadDataFromLocalStorage(setTheme, setChatContainer)
      .then((loadedLastMessageText) => {\
        reLoadLastChat(loadedLastMessageText, setChatContainer, setChatInput, setIsTextAreaDisabled);
      });

    // Retrieve trackName and artistName from local storage (can be stored like this cos its not sensitive)
    const savedTrackName = localStorage.getItem("trackName");
    const savedArtistName = localStorage.getItem("artistName");

    if (savedTrackName && savedArtistName) {
      setTrackName(savedTrackName);
      setArtistName(savedArtistName);
    }
  }, []);

  const createChatElement = (content: string, className: string) => {
    const chatDiv: HTMLElement = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // dynamic button to send Jokes prompt to Cody
  const handleJBtnClick = () => {
    const savedTrackName = localStorage.getItem("trackName");
    const savedArtistName = localStorage.getItem("artistName");
    if (savedTrackName && savedArtistName) {
      console.log("Retrieved Track Name: ", savedTrackName);
      console.log("Retrieved Artist Name: ", savedArtistName);

      if (!isTextAreaDisabled) {
        setIsTextAreaDisabled(true);
        // Use template literals to include the variables in your string
        const jokePrompt = `Tell me a joke, ideally related to a member of ${savedArtistName} and their song ${savedTrackName}`;
        handleOutgoingChat(jokePrompt, setChatContainer, setChatInput, setIsTextAreaDisabled);
      }
    }
  };

  // dynamic button to send Stories prompt to Cody
  const handleSBtnClick = () => {
    const savedTrackName = localStorage.getItem("trackName");
    const savedArtistName = localStorage.getItem("artistName");
    if (savedTrackName && savedArtistName) {
      if (!isTextAreaDisabled) {
        setIsTextAreaDisabled(true);
        const storyPrompt = `Narrate a story, preferably about a member of ${savedArtistName} and the inception of their song ${savedTrackName}`;
        handleOutgoingChat(storyPrompt, setChatContainer, setChatInput, setIsTextAreaDisabled);
      }
    }
  };


  // dynamic button to send News prompt to Cody
  const handleNBtnClick = () => {
    const savedTrackName = localStorage.getItem("trackName");
    const savedArtistName = localStorage.getItem("artistName");
    if (savedTrackName && savedArtistName) {
      if (!isTextAreaDisabled) {
        setIsTextAreaDisabled(true);
        const newsPrompt = `Provide recent news, focusing on a member of ${savedArtistName} and their song ${savedTrackName}`;
        handleOutgoingChat(newsPrompt, setChatContainer, setChatInput, setIsTextAreaDisabled);
      }
    }
  };

  const handleLogOut = async () => {
    try {
      if(auth){
        await auth.signOut(); 
      }
      localStorage.removeItem("all-chats");
      document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // this deletes the cookie for uid
      localStorage.removeItem("trackName"); 
      localStorage.removeItem("artistName"); 
      navigate('/sign-in');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };


  // call to send message from textarea
  const handleOutgoingChatClick = async () => {
    if (!isTextAreaDisabled) {
      setIsTextAreaDisabled(true);
      await handleOutgoingChat(chatInput, setChatContainer, setChatInput, setIsTextAreaDisabled);
    }
  };

  const handleDeleteChats = () => {
    localStorage.removeItem("all-chats");
    setChatContainer("");
    setIsTextAreaDisabled(false);
  };


// toggle between light and dark mode
  const toggleTheme = () => {
    ThemeService.toggleTheme();
  };

  return (
    <>
      {chatContainer ? (
        <div className="chat-container" dangerouslySetInnerHTML={{ __html: chatContainer }}></div>
      ) : (
        <div className="default-text">
          <img src="/images/logo.png" alt="user" />
          <h1>Turing GPT</h1>
          <p>Enjoy the beauty of CodyAI.</p>
        </div>
      )}

      <div className="lower-container">
        <div className="button-container" style={{ float: 'left' }}>
          {artistName && trackName && (
            <>
              <button onClick={handleJBtnClick}>Jokes</button>
              <button onClick={handleNBtnClick}>News</button>
              <button onClick={handleSBtnClick}>Stories</button>
            </>
          )}
        </div>
        <div className="typing-container">
          <div className="typing-content">
            <div className="typing-textarea">
              <textarea
                id="chat-input"
                spellCheck={false}
                placeholder="Enter a prompt here"
                required
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTextAreaDisabled}
              ></textarea>
              <span className="material-symbols-rounded" onClick={handleOutgoingChatClick}>
                send
              </span>
            </div>
            <div className="typing-controls">
              <span id="theme-btn" className="material-symbols-rounded" onClick={toggleTheme}>
                light_mode
              </span>
              <span id="delete-btn" className="material-symbols-rounded" onClick={handleDeleteChats}>
                delete
              </span>
            </div>
          </div>
        </div>
        <span id="delete-btn" className="logout-btn material-symbols-rounded" onClick={handleLogOut}>
          logout
        </span>
      </div>
    </>
  );
};

export default Chats;
