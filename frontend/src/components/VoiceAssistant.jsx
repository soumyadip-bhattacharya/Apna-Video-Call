import React, { useState, useEffect, useRef } from 'react';
import { Paper, IconButton, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import CallIcon from '@mui/icons-material/Call'; 
import styles from '../styles/voiceAssistant.module.css'; 

export default function VoiceAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    // --- 1. HELPER FUNCTIONS (Moved to top) ---

    // Text-to-Speech function
    const speak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    // Bot Logic
    const getBotResponse = (text) => {
        const lowerText = text.toLowerCase();

        // 1. GREETING
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hello! I can help you register, join as a guest, start a meeting, or use the chat.";
        }
        // 2. REGISTER
        if (lowerText.includes('register') || lowerText.includes('sign up')) {
            return "Click 'Register' at the top right. Select 'Sign Up', enter your details, and click 'Create Account'.";
        }
        // 3. LOGIN
        if (lowerText.includes('login') || lowerText.includes('sign in')) {
            return "Click 'Login' at the top right. You can sign in with your username or continue with Google.";
        }
        // 4. JOIN AS GUEST
        if (lowerText.includes('guest')) {
            return "Click the 'Join as Guest' button next to the orange 'Get Started' button on the home page.";
        }
        // 5. NEW MEETING
        if (lowerText.includes('new meeting') || lowerText.includes('start')) {
            return "Once logged in, click the purple 'New Meeting' button on the dashboard.";
        }
        // 6. JOIN MEETING
        if (lowerText.includes('join meeting') || lowerText.includes('code')) {
            return "Enter the meeting code in the box and click 'Join'. Then click 'CONNECT'.";
        }
        // 7. CHAT
        if (lowerText.includes('chat') || lowerText.includes('message')) {
            return "Inside a call, click the message bubble icon in the bottom bar to open the chat.";
        }
        // 8. SCREEN SHARE
        if (lowerText.includes('screen') || lowerText.includes('share')) {
            return "Click the Screen Share icon in the meeting toolbar.";
        }
        // 9. HISTORY
        if (lowerText.includes('history')) {
            return "You can view your past meeting codes in the list on your dashboard.";
        }

        return "I didn't catch that. Try asking 'How do I register?' or 'How do I join a meeting?'.";
    };

    // Main Message Handler (Defined BEFORE useEffect)
    const handleSendMessage = (textOverride) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
        setInput('');

        setTimeout(() => {
            const botReply = getBotResponse(textToSend);
            setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
            speak(botReply);
        }, 500);
    };

    // --- 2. EFFECTS (Now safe to use handleSendMessage) ---

    // Initialize Speech Recognition
    useEffect(() => {
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.lang = 'en-US';
            recognition.current.interimResults = false;
            
            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                // Now this function is definitely defined
                handleSendMessage(transcript);
            };
            
            recognition.current.onend = () => setIsListening(false);
        }
    }, []); // Empty dependency array is fine here

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // --- 3. UI HANDLERS ---

    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState && messages.length === 0) {
            const welcome = "Hello! I'm your Apna Video Call assistant. Ask me how to register, chat, or join a meeting!";
            setMessages([{ sender: 'bot', text: welcome }]);
            speak(welcome);
        }
    };

    const toggleListening = () => {
        if (isListening) recognition.current.stop();
        else { setIsListening(true); recognition.current.start(); }
    };

    // --- 4. RENDER ---

    return (
        <div className={styles.assistantContainer}>
            {isOpen && (
                <Paper elevation={6} className={styles.chatWindow}>
                    <div className={styles.header}>
                        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                            <div className={styles.headerLogoWrapper}>
                                <CallIcon className={styles.neonIconSmall} />
                            </div>
                            <Typography variant="subtitle1" style={{fontWeight:'bold'}}>AI Assistant</Typography>
                        </div>
                        <IconButton size="small" onClick={handleToggle} style={{color:'white'}}><CloseIcon /></IconButton>
                    </div>
                    
                    <div className={styles.messageList}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.inputArea}>
                        <IconButton onClick={toggleListening} color={isListening ? "error" : "primary"}>
                            {isListening ? <MicOffIcon /> : <MicIcon />}
                        </IconButton>
                        <input 
                            className={styles.inputField} 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Ask..." 
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                        />
                        <IconButton onClick={() => handleSendMessage()} color="primary">
                            <SendIcon />
                        </IconButton>
                    </div>
                </Paper>
            )}
            
            {!isOpen && (
                <div className={styles.fabWrapper} onClick={handleToggle}>
                    <CallIcon className={styles.neonIconLarge} />
                </div>
            )}
        </div>
    );
}

