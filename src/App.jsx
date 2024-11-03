import React, { useState, useEffect } from 'react';
import './App.css'; 
import { GoogleGenerativeAI } from '@google/generative-ai';

function LoadingSpinner() {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
        </div>
    );
}

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [turnCount, setTurnCount] = useState(1);
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const API_KEY = import.meta.env.VITE_API_KEY;

    const randomizePrompt = (prompt) => {
        const randomChoice = Math.floor(Math.random() * 2);
        switch (randomChoice) {
            case 0:
                return `Repeat what I said in negative sense ${prompt}`;
            case 1:
                return `${prompt}... dont't answer it and say a lame excuse`;
            default:
                return prompt;
        }
    };

    const handleSend = async () => {
        if (!message) return;

        try {
            let prompt = message;
            if (turnCount % 2 === 0) {
               prompt = randomizePrompt(prompt);
            }

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                systemInstruction: "Respond in plain text without any Markdown formatting less than 50 words"
            });
            const result = await model.generateContent(prompt);

            setResponse(result.response.text || "No response received");
            setMessage("");
            setTurnCount(turnCount + 1);
        } catch (error) {
            console.error("Error generating content:", error);
            setResponse("An error occurred while generating the response.");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); 
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="app">
                <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="inputBox"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="send-button" onClick={handleSend}>&#10145;</button>
            </div>
    );
}

export default App;
