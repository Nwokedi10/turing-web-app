
// load theme here
const loadDataFromLocalStorage = (setTheme: (value: string) => void, setChatContainer: (value: string) => void) => {
  return new Promise<string>((resolve) => {
    const themeColor = localStorage.getItem("themeColor");
    if (themeColor === "light_mode") {
      document.body.classList.add("light-mode");
      setTheme("light_mode");
    } else {
      document.body.classList.remove("light-mode");
      setTheme("dark_mode");
    }

    const savedChatHistory = localStorage.getItem("all-chats");

    if (savedChatHistory) {
      // separate the saved chat history into individual chat messages here
      const chatMessages = savedChatHistory.split("<!--separator-->");

      // hold the chat container as a string in a variable
      let chatContainerContent = "";

      chatMessages.forEach((chatMessage, index) => {
        // Check if the chat message is an outgoing message (not incoming)
        if (chatMessage.includes('outgoing')) {
          // If it's an outgoing message, create the content for a SendMessage card
          const sendMessageContent = chatMessage;
          chatContainerContent += sendMessageContent;
        } else {
          // here is where the reply from the bot will be populated
          chatContainerContent += chatMessage;
        }

        // Check if this is the last chat message is an outgoing message to ensure users can access previous replies that were unaswered
        if (index === chatMessages.length - 1 && !chatMessage.includes('incoming')) {
          const lastMessage = document.createElement('div');
          lastMessage.innerHTML = chatMessage;
          const chatDetails = lastMessage.querySelector('.chat-details p');
          if (chatDetails) {
            const lastMessageText = chatDetails.textContent!.trim();
            resolve(lastMessageText);
          }
        }
      });

      setChatContainer(chatContainerContent);
    }
  });
};

export default { loadDataFromLocalStorage };


