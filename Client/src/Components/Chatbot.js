import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import OpenAI from "openai";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "AI Chatbot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    // apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    setIsLoading(true);

    try {
      const userMessage = { role: "user", content: inputMessage };
      const response = await openai.chat.completions.create({
        messages: [
          ...messages,
          { role: "system", content: "You are a chatbot." },
          userMessage,
        ],
        model: "gpt-3.5-turbo",
      });

      const assistantResponse = response.choices[0].message.content;
      const updatedMessages = [
        ...messages,
        userMessage,
        { role: "assistant", content: assistantResponse },
      ];
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInputMessage("");
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container-mask">
      <div className="chatbot-messages-mask">
        {messages.map((message, index) => (
          <div key={index} className={`message-mask ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="chatbot-input-mask">
        <input
          className="inp-mask"
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="btn-mask"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
