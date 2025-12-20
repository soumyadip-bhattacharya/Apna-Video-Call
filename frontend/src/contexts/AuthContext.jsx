import axios from "axios";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";
import server from "../environment";

// --- NEW IMPORTS FOR GOOGLE AUTH ---
import { signInWithPopup } from "firebase/auth"; 
import { auth, googleProvider } from "../firebaseConfig"; // Ensure this file exists and exports auth & googleProvider

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
});

export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const router = useNavigate();

    // --- 1. EXISTING: REGISTER ---
    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            });

            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    };

    // --- 2. EXISTING: LOGIN ---
    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                setUserData(request.data.user); // Update state if backend returns user
                router("/home");
            }
        } catch (err) {
            throw err;
        }
    };

    // --- 3. NEW: GOOGLE LOGIN ---
    const handleGoogleSignIn = async () => {
        try {
            // A. Trigger Firebase Google Popup
            const result = await signInWithPopup(auth, googleProvider);
            const googleUser = result.user;

            // B. Prepare Data for Backend
            const userInfo = {
                name: googleUser.displayName,
                email: googleUser.email,
                username: googleUser.email.split('@')[0], // Use email prefix as username
                image: googleUser.photoURL,
                provider: 'google'
            };

            // C. Send to Backend (Note: using 'client' instance we defined above)
            // Ensure your backend route is exactly `/auth/google` relative to the baseURL
            const response = await client.post("/auth/google", userInfo);

            // D. Success Handling
            if (response.status === httpStatus.OK || response.status === httpStatus.CREATED) {
                localStorage.setItem("token", response.data.token);
                setUserData(response.data.user);
                router("/home"); // Redirect to home/dashboard
            }
            
        } catch (error) {
            console.error("Google Auth Error:", error);
            throw error;
        }
    };

    // --- 4. EXISTING: GET HISTORY ---
    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data;
        } catch (err) {
            throw err;
        }
    };

    // --- 5. EXISTING: ADD HISTORY ---
    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request;
        } catch (e) {
            throw e;
        }
    };

    // --- CONTEXT DATA OBJECT ---
    const data = {
        userData, 
        setUserData, 
        addToUserHistory, 
        getHistoryOfUser, 
        handleRegister, 
        handleLogin,
        handleGoogleSignIn // Added this to the export
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};