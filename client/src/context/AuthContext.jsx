/**
 * @file AuthContext.jsx
 * @description Global state provider for user authentication and session hydration.
 */
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem("atlas-user-profile");
    return saved ? JSON.parse(saved) : {
          name: "TRAVELER ONE",
          email: "traveler.one@atlas.com",
          bio: "Passionate explorer.",
          location: "New Delhi, India",
        };
  });

  useEffect(() => {
    localStorage.setItem("atlas-user-profile", JSON.stringify(profileData));
  }, [profileData]);
//Persistance logic:
  const checkAuth = async () => {
    try {
      const response = await API.get("/auth/check-auth");
      const userData = response.data.user;

      setUser(userData);
      setIsAuthenticated(true);
      setIsVerified(userData.isVerified);

      setProfileData({ ...userData });
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setIsVerified(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      setIsVerified(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCheckingAuth) setIsCheckingAuth(false); 
    }, 3000);
    checkAuth();
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isCheckingAuth, isVerified, profileData, setProfileData,checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);