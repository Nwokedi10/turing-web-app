import React from "react";

interface MessageProps {
  content: string;
}
// create the outgoing message card here
const SenderMessage: React.FC<MessageProps> = ({ content }) => {
  return (
    <div className="chat outgoing">
      <div className="chat-details">
        <img src="/images/user.png" alt="user" />
        <p>{content}</p>
      </div>
    </div>
  );
};

export default SenderMessage;
