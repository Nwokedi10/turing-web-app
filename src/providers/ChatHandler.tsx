import React, { Dispatch, SetStateAction } from 'react';
import ReplyMessage from '../cards/ReplyMessage';
import ErrorMessage from '../cards/ErrorReply';
import MessageModel from '../models/MessageModel';
import { renderToString } from 'react-dom/server';
import SenderMessage from '../cards/SendMessage';
import generateUniqueID from '../utils/GenerateUniqueID';
import { chatWithCody } from '../api/Api';
import StreamingHandler from './HandleMessages';


// show typing animation while waiting for Cody reply.
const showTypingAnimation = (
  setChatContainer: Dispatch<SetStateAction<string>>,
  shouldShowAnimation: boolean
) => {
  const typingAnimationHtml = `
    <div class="chat incoming">
      <div class="chat-details">
        <img src="images/logo.png" alt="turing-img">
        <div class="typing-animation">
          <div class="typing-dot" style="--delay: 0.2s"></div>
          <div class="typing-dot" style="--delay: 0.3s"></div>
          <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
      </div>
    </div>
  `;

  if (shouldShowAnimation) {
    setChatContainer((prevChatContainer) => prevChatContainer + typingAnimationHtml);
  } else {
    setChatContainer((prevChatContainer) => prevChatContainer.replace(typingAnimationHtml, ''));
  }
};


// this processes outgoing chats
const handleOutgoingChat = async (
  chatInput: string,
  setChatContainer: Dispatch<SetStateAction<string>>,
  setChatInput: Dispatch<SetStateAction<string>>,
  isTextAreaDisabled: Dispatch<SetStateAction<boolean>>
) => {
  if (chatInput.trim() !== '') {
    // Create a new outgoing message
    const newMessage: MessageModel = {
      uid: 'unique_id',
      status: 'sent',
      date: new Date(),
      message: chatInput,
      title: 'User',
      sender: 'user',
      isIncoming: false,
    };
    isTextAreaDisabled(true);

    let savedChatHistory = localStorage.getItem('all-chats') || '';

    const outgoingChatHtml = renderToString(<SenderMessage content={chatInput} />);

    savedChatHistory += `<!--separator-->${outgoingChatHtml}`;

    // Update localStorage with the updated chat history
    localStorage.setItem('all-chats', savedChatHistory);

    // Set the chat container with the chat history, including the new outgoing message
    setChatContainer((prevChatContainer) => prevChatContainer + outgoingChatHtml);

    // this Clears the chat input
    setChatInput('');

    // Show the loading animation
    showTypingAnimation(setChatContainer, true);


    try {


      // initiate interaction with Cody
      const response = await chatWithCody(newMessage.message);

      if(response){
        // Define a variable to keep track of the response chunks
        let replyChunks = "";
        // start response streaming... this requires a live environment due to CORS validation by codyAI response stream
        const onData = (dataChunk: string) => {
          if (dataChunk === "END") {
            // Streaming is complete; save the chat history to localStorage
            savedChatHistory += replyChunks;
            localStorage.setItem('all-chats', savedChatHistory);

            // Enable the text area
            isTextAreaDisabled(false);
          } else {
            // Update replyChunks as new data comes in
            replyChunks += dataChunk;

            // Create a dynamic reply message and update the chat container
            const replyMessage = `<!--separator-->${renderToString(<ReplyMessage content={dataChunk} />)}`;
            setChatContainer((prevChatContainer) => prevChatContainer + replyMessage);
          }
        };

        const onError = (error: Error) => {
          console.error('API Error:', error);
          const errorM = "Oops! Server is overloaded or your network is not steady, please try later!";
          const errorChatHtml = renderToString(<ErrorMessage content={errorM} />);
          setChatContainer((prevChatContainer) => prevChatContainer + errorChatHtml);
          isTextAreaDisabled(true);
        };


        return (
          <StreamingHandler
            onData={onData}
            onError={onError}
            streamUrl={response.toString()}
          />
        );
      } else {
        console.log("error retrieving from codyAI");
        const errorM = "Please I discovered CodyAI has CORS protection for its response stream.";
        const errorChatHtml = renderToString(<ErrorMessage content={errorM} />);
        setChatContainer((prevChatContainer) => prevChatContainer + errorChatHtml);
        isTextAreaDisabled(true);
      }

    } catch (error) {
      // Handle other errors
      console.error('Other Error:', error);
      const errorM = "Oops! Server is overloaded or your network is not steady, please try later!";
        const errorChatHtml = renderToString(<ErrorMessage content={errorM} />);
        setChatContainer((prevChatContainer) => prevChatContainer + errorChatHtml);
        isTextAreaDisabled(true);
    } finally {
        showTypingAnimation(setChatContainer, false);
    }
    


  }
};

let reloading = false;

const reLoadLastChat = async (
  chatInput: string,
  setChatContainer: Dispatch<SetStateAction<string>>,
  setChatInput: Dispatch<SetStateAction<string>>,
  isTextAreaDisabled: Dispatch<SetStateAction<boolean>>
) => {
  if (chatInput.trim() !== '' && !reloading) {
    reloading = true;
    isTextAreaDisabled(true);

    // Get the current chat history from localStorage
    let savedChatHistory = localStorage.getItem('all-chats') || '';

    // Clear the chat input
    setChatInput('');

    // Show the typing animation
    showTypingAnimation(setChatContainer, true);

      try {

        const response = await chatWithCody(chatInput);

        if(response){
        // Define a variable to keep track of the response chunks
        let replyChunks = "";
        // start response streaming... this requires a live environment due to CORS validation by codyAI response stream
        const onData = (dataChunk: string) => {
          if (dataChunk === "END") {
            // Streaming is complete; save the chat history to localStorage
            savedChatHistory += replyChunks;
            localStorage.setItem('all-chats', savedChatHistory);

            // Enable the text area
            isTextAreaDisabled(false);
          } else {
            // Update replyChunks as new data comes in
            replyChunks += dataChunk;

            // Create a dynamic reply message and update the chat container
            const replyMessage = `<!--separator-->${renderToString(<ReplyMessage content={dataChunk} />)}`;
            setChatContainer((prevChatContainer) => prevChatContainer + replyMessage);
          }
        };

        const onError = (error: Error) => {
          console.error('API Error:', error);
          const errorM = "Oops! Server is overloaded or your network is not steady, please try later!";
          const errorChatHtml = renderToString(<ErrorMessage content={errorM} />);
          setChatContainer((prevChatContainer) => prevChatContainer + errorChatHtml);
          isTextAreaDisabled(true);
        };


        return (
          <StreamingHandler
            onData={onData}
            onError={onError}
            streamUrl={response.toString()}
          />
        );
      } else {
        console.log("error retrieving from codyAI");
        const errorM = "Please I discovered CodyAI has CORS protection for its response stream.";
        const errorChatHtml = renderToString(<ErrorMessage content={errorM} />);
        setChatContainer((prevChatContainer) => prevChatContainer + errorChatHtml);
        isTextAreaDisabled(true);
      }
      reloading = true;

    } catch (error) {
      // Handle other errors
      console.error('Other Error:', error);
    } finally {
      showTypingAnimation(setChatContainer, false);
    }
  }
};


export {
  handleOutgoingChat,
  reLoadLastChat,
};
