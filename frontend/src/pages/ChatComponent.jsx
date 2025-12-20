import React, { useRef, useState, useEffect } from 'react';
import { IconButton, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Popover } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiPicker from 'emoji-picker-react';
import styles from '../styles/videoComponent.module.css';

const ChatComponent = ({
  setModal,
  messages,
  sendMessage,
  selectedRecipient,
  setSelectedRecipient,
  participants,
  socketIdRef,
  username,
  deleteMessage,
  userNames // Receive userNames map as prop
}) => {
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [emojiAnchor, setEmojiAnchor] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setEmojiAnchor(null);
  };

  const closeChat = () => {
    setModal(false);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const recipientToSend = selectedRecipient === 'everyone' ? undefined : selectedRecipient;
      sendMessage(message, username, recipientToSend);
      setMessage('');
      setEmojiAnchor(null);
    }
  };

  return (
    <div className={styles.chatContainer}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <h3>Chat</h3>
          <IconButton onClick={closeChat} size="small" style={{color: 'white'}}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Recipient Selector */}
        <div className={styles.chatRecipientBar}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="recipient-label">Send to</InputLabel>
            <Select
              labelId="recipient-label"
              id="recipient-select"
              value={selectedRecipient}
              label="Send to"
              onChange={(e) => setSelectedRecipient(e.target.value)}
            >
              <MenuItem value="everyone">Everyone</MenuItem>
              {participants.map((p) => {
                // Ensure we display the real name using the userNames map
                const displayName = userNames[p.socketId] || p.name || p.socketId;
                return (
                    <MenuItem key={p.socketId} value={p.socketId}>
                    {p.socketId === socketIdRef.current ? `${username} (You)` : displayName}
                    </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        {/* Messages List */}
        <div className={styles.chattingDisplay}>
          {messages.length !== 0 ? (
            messages.map((item) => (
              <div key={item.id} className={`${styles.messageWrapper} ${item.isMe ? styles.myMessage : styles.otherMessage}`}>
                
                <div className={styles.messageBubble}>
                    {/* Display Sender Name */}
                    {!item.isMe && <div className={styles.senderName}>{item.sender}</div>}
                    
                    <div className={styles.messageText}>{item.data}</div>
                    
                    <div className={styles.timestamp}>
                        {item.timestamp}
                        {item.recipient && item.recipient !== 'everyone' && <span> (Private)</span>}
                    </div>

                    {item.isMe && (
                        <IconButton onClick={() => deleteMessage(item.id)} className={styles.deleteButton} size="small">
                        <DeleteIcon fontSize="inherit" color="error" />
                        </IconButton>
                    )}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noMessages}>No messages yet. Say hello!</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.chattingArea}>
          <IconButton onClick={(e) => setEmojiAnchor(e.currentTarget)} color="primary">
            😊
          </IconButton>
          
          <TextField
            className={styles.chatInput}
            value={message}
            onChange={handleMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            fullWidth
          />
          
          <IconButton onClick={handleSendMessage} color="primary">
            <SendIcon />
          </IconButton>
          
          <Popover
            open={!!emojiAnchor}
            anchorEl={emojiAnchor}
            onClose={() => setEmojiAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Popover>
        </div>
    </div>
  );
};

export default ChatComponent;