import React from "react";

interface MessageProps {
  content: string;
}
// create the incoming message card here
const ReplyMessage: React.FC<MessageProps> = ({ content }) => {
  return (
    <div className="chat incoming">
      <div className="chat-details">
        <img src="/images/logo.png" alt="user" />
        <p>{content}</p>
      </div>
    </div>
  );
};

export default ReplyMessage;
