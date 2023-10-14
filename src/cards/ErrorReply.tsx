import React from "react";

interface MessageProps {
  content: string;
}

const ErrorMessage: React.FC<MessageProps> = ({ content }) => {
  return (
    <div className="chat incoming">
      <div className="chat-details">
        <img src="/images/logo.png" alt="user" />
        <p style={{ color: '#DC1515' }}>{content}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
