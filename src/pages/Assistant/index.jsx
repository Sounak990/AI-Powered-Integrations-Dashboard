import React, { useState } from "react";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: inputValue },
      ]);
      setInputValue("");

      // Simulate a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "This is an automated response." },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-70px)] overflow-y-auto mt-[70px] py-3 px-3 bg-[#04051B] flex flex-col gap-4 font-Gilroy">
      {/* Chat messages */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primaryColor text-white"  // User message background
                  : "bg-[#1E1F28] text-white/75" // Bot message background
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border-none bg-[#1E1F28] text-white placeholder-white/75 focus:outline-none focus:ring-2 focus:ring-primaryColor"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="px-4 py-2 rounded-lg bg-primaryColor hover:bg-primary/90 text-white"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
