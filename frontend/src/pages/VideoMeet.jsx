import React, { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { IconButton, TextField, Button, Badge } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import styles from '../styles/videoComponent.module.css';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import server from '../environment';
import ChatComponent from './ChatComponent';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
};

const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement('canvas'), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
};

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState(null);
    let [audio, setAudio] = useState(null);
    let [screen, setScreen] = useState(false);
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState(null);
    let [messages, setMessages] = useState([]);
    
    let [participants, setParticipants] = useState([]);
    let [selectedRecipient, setSelectedRecipient] = useState('everyone');
    
    // We use both State (for rendering) and Ref (for logic inside event listeners)
    let [userNames, setUserNames] = useState({});
    const userNamesRef = useRef({}); 

    let [newMessages, setNewMessages] = useState(0);
    
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState('');
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);

    const getPermissions = useCallback(async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoAvailable(!!videoPermission);
            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioAvailable(!!audioPermission);
            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);
            if (videoPermission || audioPermission) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoPermission, audio: audioPermission });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) localVideoref.current.srcObject = userMediaStream;
                }
            }
        } catch (error) { console.log(error); }
    }, []);

    const getUserMediaSuccess = useCallback((stream) => {
        try { window.localStream.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
        window.localStream = stream;
        localVideoref.current.srcObject = stream;
        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description).then(() => {
                    socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
                }).catch((e) => console.log(e));
            });
        }
        stream.getTracks().forEach((track) => (track.onended = () => {
            setVideo(false); setAudio(false);
            try { localVideoref.current.srcObject.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;
            for (let id in connections) {
                connections[id].addStream(window.localStream);
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description).then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
                    }).catch((e) => console.log(e));
                });
            }
        }));
    }, []);

    const getUserMedia = useCallback(() => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio }).then(getUserMediaSuccess).catch((e) => console.log(e));
        } else {
            try { localVideoref.current.srcObject.getTracks().forEach((track) => track.stop()); } catch (e) {}
        }
    }, [video, audio, videoAvailable, audioAvailable, getUserMediaSuccess]);

    const getDislayMediaSuccess = useCallback((stream) => {
        try { window.localStream.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
        window.localStream = stream;
        localVideoref.current.srcObject = stream;
        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description).then(() => {
                    socketRef.current.emit('signal', id, JSON.stringify({ sdp: connections[id].localDescription }));
                }).catch((e) => console.log(e));
            });
        }
        stream.getTracks().forEach((track) => (track.onended = () => {
            setScreen(false);
            try { localVideoref.current.srcObject.getTracks().forEach((track) => track.stop()); } catch (e) { console.log(e); }
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoref.current.srcObject = window.localStream;
            getUserMedia();
        }));
    }, [getUserMedia]);

    const getDislayMedia = useCallback(() => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(getDislayMediaSuccess).catch((e) => console.log(e));
            }
        }
    }, [screen, getDislayMediaSuccess]);

    useEffect(() => { getPermissions(); }, [getPermissions]);
    useEffect(() => { if (video !== null && audio !== null) getUserMedia(); }, [video, audio, getUserMedia]);
    useEffect(() => { if (screen !== null) getDislayMedia(); }, [screen, getDislayMedia]);


    const gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);
        if (fromId !== socketIdRef.current) {
            if (!connections[fromId]) return;

            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: connections[fromId].localDescription }));
                            }).catch((e) => console.log(e));
                        }).catch((e) => console.log(e));
                    }
                }).catch((e) => console.log(e));
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e) => console.log(e));
            }
        }
    };

    const addMessage = (data, sender, socketIdSender, recipient) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // --- CRITICAL FIX: Look up name from Ref (guaranteed current) ---
        // This ensures that even if 'sender' comes as a Token/ID, we find the real name
        const senderName = userNamesRef.current[socketIdSender] || sender || socketIdSender;
        const isMe = socketIdSender === socketIdRef.current;

        setMessages((prevMessages) => [
            ...prevMessages, 
            { 
                sender: senderName, 
                data: data, 
                recipient: recipient, 
                isMe: isMe, 
                timestamp: timestamp, 
                id: Math.random().toString(36).substr(2, 9)
            }
        ]);

        if (!isMe && !showModal) {
            setNewMessages((prev) => prev + 1);
        }
    };

    const sendMessage = (msg, usr, rec) => {
        if(socketRef.current) {
            socketRef.current.emit('chat-message', msg, usr, rec);
        }
    };

    const deleteMessage = (messageId) => {
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    };

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('signal', gotMessageFromServer);
        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href, username);
            socketIdRef.current = socketRef.current.id;
            
            socketRef.current.on('chat-message', addMessage);
            
            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
                setParticipants((prev) => prev.filter(p => p.socketId !== id));
                
                // Update both State and Ref
                setUserNames((prev) => { 
                    const newNames = {...prev}; 
                    delete newNames[id]; 
                    userNamesRef.current = newNames; // Sync Ref
                    return newNames; 
                });
            });

            socketRef.current.on('user-joined', (id, clients, names) => {
                const incomingNames = names || {};
                
                // --- CRITICAL FIX: Update State AND Ref ---
                setUserNames((prevNames) => {
                    const mergedNames = { ...prevNames, ...incomingNames };
                    userNamesRef.current = mergedNames; // Keep Ref in sync immediately
                    
                    const participantList = clients.map((sid) => ({
                        socketId: sid,
                        // Use the merged names to ensure we don't display tokens
                        name: mergedNames[sid] || sid
                    }));
                    setParticipants(participantList);
                    
                    return mergedNames;
                });
                
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ ice: event.candidate }));
                        }
                    };
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find((video) => video.socketId === socketListId);
                        if (videoExists) {
                            setVideos((videos) => {
                                const updatedVideos = videos.map((video) => (video.socketId === socketListId ? { ...video, stream: event.stream } : video));
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true,
                            };
                            setVideos((videos) => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;
                        try { connections[id2].addStream(window.localStream); } catch (e) {}
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', id2, JSON.stringify({ sdp: connections[id2].localDescription }));
                            }).catch((e) => console.log(e));
                        });
                    }
                }
            });
        });
    };

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    let handleVideo = () => setVideo(!video);
    let handleAudio = () => setAudio(!audio);
    let handleScreen = () => setScreen(!screen);
    let handleEndCall = () => {
        try { localVideoref.current.srcObject.getTracks().forEach((track) => track.stop()); } catch (e) {}
        window.location.href = '/';
    };

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    };

    let handleChatToggle = () => {
        setModal(!showModal);
        if(!showModal) setNewMessages(0); 
    };

    return (
        <div>
            {askForUsername ? (
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyBox}>
                        <h2>Join Meeting</h2>
                        <TextField 
                            fullWidth 
                            margin="normal"
                            label="Enter your Name" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            variant="outlined" 
                        />
                        <Button variant="contained" color="primary" onClick={connect} disabled={!username}>
                            Connect
                        </Button>
                        <div className={styles.lobbyVideo}>
                            <video ref={localVideoref} autoPlay muted></video>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.meetVideoContainer}>
                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId} className={styles.peerVideoContainer}>
                                <video
                                    data-socket={video.socketId}
                                    ref={(ref) => {
                                        if (ref && video.stream) ref.srcObject = video.stream;
                                    }}
                                    autoPlay
                                    playsInline
                                    className={styles.peerVideo}
                                ></video>
                                <span className={styles.peerName}>
                                    {(userNames[video.socketId]) || video.socketId}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: 'white' }}>
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: 'white' }}>
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        {screenAvailable && (
                            <IconButton onClick={handleScreen} style={{ color: 'white' }}>
                                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                            </IconButton>
                        )}
                        <Badge badgeContent={newMessages} color="error" overlap="circular">
                            <IconButton onClick={handleChatToggle} style={{ color: 'white' }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                        <IconButton onClick={handleEndCall} style={{ color: 'red' }}>
                            <CallEndIcon />
                        </IconButton>
                    </div>
                    
                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    {showModal && (
                        <div className={styles.chatRoom}>
                            <ChatComponent
                                messages={messages}
                                sendMessage={sendMessage}
                                selectedRecipient={selectedRecipient}
                                setSelectedRecipient={setSelectedRecipient}
                                participants={participants}
                                username={username}
                                deleteMessage={deleteMessage}
                                setModal={setModal}
                                socketIdRef={socketIdRef}
                                userNames={userNames} 
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}