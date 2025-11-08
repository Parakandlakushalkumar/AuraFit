import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize user object to always have _id
  const normalizeUser = (userData) => {
    if (!userData) return null;
    // If user has 'id' but not '_id', copy it to '_id'
    if (userData.id && !userData._id) {
      return { ...userData, _id: userData.id };
    }
    return userData;
  };

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem("aurafit_token");
    const storedUser = localStorage.getItem("aurafit_user");
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(normalizeUser(parsedUser));
      } catch (err) {
        console.error("Failed to parse user", err);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem("aurafit_token", token);
    localStorage.setItem("aurafit_user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const nextUser = { ...(prev || {}), ...updates };
      localStorage.setItem("aurafit_user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = () => {
    localStorage.removeItem("aurafit_token");
    localStorage.removeItem("aurafit_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
